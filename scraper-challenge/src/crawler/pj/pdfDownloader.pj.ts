// src/crawler/pj/pdfDownloader.pj.ts
import fs from "fs";
import path from "path";
import { AxiosInstance } from "axios";

const MAX_RETRIES = 5;

export async function downloadPdfPJ(
    client: AxiosInstance,
    pdfUrl: string,
    outputDir: string
): Promise<void> {
    
    const fileName = path.basename(pdfUrl.split("?")[0]);
    const filePath = path.join(outputDir, fileName);

    fs.mkdirSync(outputDir, { recursive: true });

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const response = await client.get(pdfUrl, {
                responseType: "stream",
            });

            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            return;
        } catch (err: any) {
            const status = err?.response?.status;

            if (status === 429 && attempt < MAX_RETRIES) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise((r) => setTimeout(r, delay));
                continue;
            }

            throw err;
        }
    }
}
