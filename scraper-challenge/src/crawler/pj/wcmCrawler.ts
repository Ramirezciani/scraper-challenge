import { createHttpClient } from "../../client/http";
import { extractResultPJ } from "./extractorResult.pj";
import { downloadPdfPJ } from "./pdfDownloader.pj";
import { writeJson } from "../../storage/writer";

interface CrawlOptions {
    baseUrl: string;
    maxPdfs?: number;
}

export async function crawlWcmJurisprudencia(
    options: CrawlOptions
): Promise<void> {
    const client = createHttpClient({
        timeoutMs: 15000,
    });

    console.log("🌐 Fetching WCM page:", options.baseUrl);

    const response = await client.get(options.baseUrl);
    const html = response.data as string;

    const results = extractResultPJ(html);

    console.log(`📄 Found ${results.length} documents`);

    writeJson("pj-results.json", results);

    const max = options.maxPdfs ?? 1;
    let downloaded = 0;

    for (const doc of results) {
        if (!doc.pdfUrl) continue;
        if (downloaded >= max) break;

        console.log(`⬇️ Downloading PDF: ${doc.pdfUrl}`);

        await downloadPdfPJ(
            client,
            doc.pdfUrl,
            "output/pdf"
        );

        downloaded++;
    }

    console.log(`✅ Downloaded ${downloaded} PDF(s)`);
}
