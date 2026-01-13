// src/storage/writer.ts

import fs from "fs";
import path from "path";

/**
 * Escribe datos en formato JSON dentro de /output/json
 */
export function writeJson<T>(fileName: string, data: T): void {
    const outputDir = path.join(process.cwd(), "output", "json");

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        "utf-8"
    );
}
