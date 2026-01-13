// src/index.ts

import { initSession, SessionStatus } from "./init/session"
import fs from "fs"
import path from "path"

import { extractDocuments } from "./crawler/mock/extractorResult"
import { writeJson } from "./storage/writer"

// 🔴 NUEVO: crawler real WCM (lo implementamos después)
import { crawlWcmJurisprudencia } from "./crawler/pj/wcmCrawler"

async function main() {
    // ======================================================
    // 1️⃣ PRUEBA EN SECO (MOCK HTML)
    // ======================================================
    const sampleHtmlPath = path.join(__dirname, "../sample-results.html")

    if (fs.existsSync(sampleHtmlPath)) {
        console.log("🧪 Running extractor in dry mode (mock HTML)...")

        const html = fs.readFileSync(sampleHtmlPath, "utf-8")
        const docs = extractDocuments(html)

        console.log("Extracted documents (sample):", docs.slice(0, 5))
        console.log("Total extracted:", docs.length)

        writeJson("sample-results.json", docs)
        console.log("✅ Sample results written to output/json/sample-results.json")
    } else {
        console.warn("⚠️ No sample HTML found. Skipping dry extractor.")
    }

    // ======================================================
    // 2️⃣ INICIALIZACIÓN DE SESIÓN (DIAGNÓSTICO)
    // ======================================================
    const session = await initSession({
        baseUrl: "https://jurisprudencia.pj.gob.pe/jurisprudenciaweb/",
    })

    console.log("Session result:", session)

    if (session.status !== SessionStatus.READY) {
        console.warn(
            "ℹ️ JSF endpoint is blocked. Falling back to WCM public site."
        )
    }

    // ======================================================
    // 3️⃣ SCRAPING REAL (SITIO ACCESIBLE)
    // ======================================================
    console.log("🚀 Starting real scraping from WCM site...")

    await crawlWcmJurisprudencia({
        baseUrl:
            "https://www.pj.gob.pe/wps/wcm/connect/cij-juris/s_cij_jurisprudencia_nuevo/as_jurisprudencia_sistematizada/as_jurisprudencia_uniforme/as_civil/as_concurrenciadeunderechoreal/",
        maxPdfs: 3, // 👈 demo controlado (muy importante)
    })

    console.log("✅ Scraping finished")
}

main().catch((err) => {
    console.error("Fatal error:", err)
})
