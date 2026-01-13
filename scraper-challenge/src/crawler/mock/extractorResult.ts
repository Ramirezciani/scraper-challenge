import * as cheerio from "cheerio";
import { ResultDocument } from "../../types/ResultDocument";

/**
 * Extractor de RESULTADOS (JSF legacy).
 * - No hace HTTP
 * - No navega
 * - Extrae solo información visible y acción asociada
 */
export function extractDocuments(html: string): ResultDocument[] {
  const $ = cheerio.load(html);
  const results: ResultDocument[] = [];

  $("table tr").each((_, row) => {
    const $row = $(row);
    const cells = $row.find("td");

    if (cells.length === 0) return;

    const link = $row.find("a").first();
    if (!link.length) return;

    const title = link.text().trim();
    if (!title) return;

    const onclick = link.attr("onclick")?.trim();
    const href = link.attr("href")?.trim();

    results.push({
      title,
      date: cells.eq(1)?.text().trim() || undefined,
      court: cells.eq(2)?.text().trim() || undefined,
      detailUrl: href || undefined,
      jsfAction: onclick || undefined,
    });
  });

  return results;
}
