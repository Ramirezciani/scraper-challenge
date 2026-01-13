import fs from "fs";
import path from "path";
import { AxiosInstance } from "axios";
import { sleep, exponentialBackoff } from "../utils/sleep";

export interface PdfDownloadResult {
    success: boolean;
    filePath?: string;
    error?: string;
}

export class PdfDownloader {
    constructor(
        private readonly client: AxiosInstance,
        private readonly outputDir: string,
        private readonly maxRetries: number = 5
    ) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
    }

    /**
     * Descarga un PDF con manejo de 429 + backoff exponencial.
     */
    async download(
        pdfUrl: string,
        fileName: string
    ): Promise<PdfDownloadResult> {
        const filePath = path.join(this.outputDir, fileName);

        for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
            const response = await this.client.get(pdfUrl, {
                responseType: "stream",
                validateStatus: () => true,
            });

            if (response.status === 200) {
                await new Promise((resolve, reject) => {
                    const stream = fs.createWriteStream(filePath);
                    response.data.pipe(stream);
                    stream.on("finish", resolve);
                    stream.on("error", reject);
                });

                return { success: true, filePath };
            }

            if (response.status === 429) {
                const delay = exponentialBackoff(attempt);
                await sleep(delay);
                continue;
            }

            return {
                success: false,
                error: `Unexpected status ${response.status}`,
            };
        }

        return {
            success: false,
            error: "Max retries exceeded (429)",
        };
    }
}
