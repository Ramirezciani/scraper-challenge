// src/crawler/pj/extractorResult.pj.ts
import * as cheerio from "cheerio";
import { ResultDocument } from "../../types/ResultDocument";

/**
 * Extractor REAL PJ – Página de resultados
 * Fuente:
 * https://www.pj.gob.pe/wps/wcm/connect/cij-juris/...
 */
export function extractResultPJ(html: string): ResultDocument[] {
    const $ = cheerio.load(html);
    const results: ResultDocument[] = [];

    $("table tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 5) return; // header / basura

        const numeroRecurso = cells.eq(0).text().trim();
        const distrito = cells.eq(1).text().trim();
        const sala = cells.eq(2).text().trim();
        const fecha = cells.eq(3).text().trim();

        if (!numeroRecurso || numeroRecurso.includes("Número")) return;

        const pdfAnchor = cells.eq(4).find("a[href]");
        const pdfUrl = pdfAnchor.attr("href");

        if (!pdfUrl) return;

        results.push({
            title: numeroRecurso,
            court: sala,
            date: fecha,
            pdfUrl: pdfUrl.startsWith("http")
                ? pdfUrl
                : `https://www.pj.gob.pe${pdfUrl}`,
        });
    });

    return results;
}

