import * as cheerio from "cheerio";
import { DetailDocument } from "../types/DetailDocument";

/**
 * Extractor de DETALLE (HTML legacy PJ).
 * - No hace HTTP
 * - No navega
 * - Extrae metadata + URL del PDF
 */
export function extractDetail(html: string): DetailDocument {
    const $ = cheerio.load(html);

    // ---- Título ----
    let title = "";

    $("h1, h2, b, strong").each((_, el) => {
        const text = $(el).text().trim();
        if (/^t[ií]tulo/i.test(text)) {
            title = text.replace(/^t[ií]tulo\s*:\s*/i, "").trim();
        }
    });

    if (!title) {
        const bodyText = $("body").text();
        const m = bodyText.match(/T[ií]tulo\s*:\s*(.+)/i);
        if (m) title = m[1].trim();
    }

    // ---- Metadata ----
    let numeroRecurso: string | undefined;
    let distrito: string | undefined;
    let sala: string | undefined;
    let fecha: string | undefined;

    $("table tr").each((_, row) => {
        const cells = $(row).find("td");
        if (cells.length < 2) return;

        const label = cells.eq(0).text().trim().toLowerCase();
        const value = cells.eq(1).text().trim();

        if (!value) return;

        if (label.includes("número") || label.includes("numero")) {
            numeroRecurso = value;
        } else if (label.includes("distrito")) {
            distrito = value;
        } else if (label.includes("sala")) {
            sala = value;
        } else if (label.includes("fecha")) {
            fecha = value;
        }
    });

    // ---- PDF ----
    let pdfUrl: string | undefined;

    const pdfAnchor = $("a")
        .filter((_, a) => {
            const href = $(a).attr("href") || "";
            return href.toLowerCase().includes(".pdf");
        })
        .first();

    if (pdfAnchor.length) {
        pdfUrl = pdfAnchor.attr("href")?.trim();
    }

    if (!pdfUrl) {
        const onclickAnchor = $("a[onclick]")
            .filter((_, a) => {
                const onclick = $(a).attr("onclick") || "";
                return /pdf/i.test(onclick);
            })
            .first();

        if (onclickAnchor.length) {
            pdfUrl = onclickAnchor.attr("onclick")?.trim();
        }
    }

    return {
        title,
        numeroRecurso,
        distrito,
        sala,
        fecha,
        pdfUrl,
    };
}
