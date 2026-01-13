// src/crawler/pj/extractorDetail.pj.ts
import * as cheerio from "cheerio";
import { DetailDocument } from "../../types/DetailDocument";

/**
 * Extractor REAL PJ – Página de detalle
 */
export function extractDetailPJ(html: string): DetailDocument {
    const $ = cheerio.load(html);

    // Título real PJ
    const title =
        $('font[color="#a00000"]')
            .first()
            .text()
            .replace(/^Título:\s*/i, "")
            .trim() || "Sin título";

    let numeroRecurso: string | undefined;
    let distrito: string | undefined;
    let sala: string | undefined;
    let fecha: string | undefined;
    let pdfUrl: string | undefined;

    $("tr.tabla").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 6) return;

        numeroRecurso = cells.eq(0).text().trim();
        distrito = cells.eq(1).text().trim();
        sala = cells.eq(2).text().trim();
        fecha = cells.eq(3).text().trim();

        const pdfAnchor = cells.eq(4).find("a[href]");
        pdfUrl = pdfAnchor.attr("href")?.trim();
    });

    return {
        title,
        numeroRecurso,
        distrito,
        sala,
        fecha,
        pdfUrl,
    };
}
