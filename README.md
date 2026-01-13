# Scraper Challenge – Jurisprudencia PJ

Scraper desarrollado en **TypeScript** como parte de un desafío técnico de scraping.
El objetivo es extraer información estructurada y documentos PDF desde el portal de
jurisprudencia del Poder Judicial del Perú, sin utilizar automatización de navegador.

---

## 🎯 Objetivo del desafío

El scraper debe ser capaz de:

- Navegar por todas las páginas de resultados del portal
- Extraer la información disponible de cada documento
- Descargar los PDFs asociados
- Manejar errores de rate limiting (HTTP 429) mediante reintentos con backoff
- Continuar la ejecución aunque existan fallos puntuales

El foco del desafío no es la descarga masiva, sino el **diseño de un scraper robusto,
mantenible y bien estructurado**.

---

## 🌐 Sitio objetivo

URL base del portal: https://jurisprudencia.pj.gob.pe/jurisprudenciaweb/faces/page/resultado.xhtml

### Consideraciones importantes

El portal presenta características propias de sistemas legacy:

- Uso de **JavaServer Faces (JSF)** y `ViewState`
- Navegación basada en estado y sesiones
- Accesos condicionados por cookies, headers y contexto
- Posibles bloqueos HTTP 403 dependiendo del entorno

Estas condiciones forman parte del desafío y fueron consideradas en el diseño
de la arquitectura del scraper.

---

## 🛠️ Tecnologías utilizadas

- Node.js
- TypeScript
- Axios
- Cheerio

No se utilizan librerías de automatización de navegador
(Puppeteer, Playwright, Selenium).

---

## 📁 Estructura del proyecto

```text
scraper-challenge/
│
├── src/
│   ├── index.ts                 # Orquestador principal
│   │
│   ├── init/
│   │   └── session.ts           # Inicialización de sesión / contexto
│   │
│   ├── client/
│   │   └── http.ts              # Cliente HTTP (cookies, headers, retry)
│   │
│   ├── crawler/
│   │   ├── paginator.ts         # Navegación / paginación JSF
│   │   ├── extractor.ts         # Extracción de datos desde HTML
│   │   └── pdfDownloader.ts     # Descarga de PDFs (429 + backoff)
│   │
│   ├── storage/
│   │   ├── writer.ts            # Persistencia de datos
│   │   └── failed.ts            # Registro de descargas fallidas
│   │
│   ├── utils/
│   │   ├── logger.ts            # Logging
│   │   └── sleep.ts             # Delays / backoff
│   │
│   └── types/
│       └── Document.ts          # Tipos de dominio
│
├── output/
│   ├── json/                    # Datos extraídos
│   └── pdf/                     # PDFs descargados
│
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```
---

## ⚙️ Instalación

    ```bash
    npm install

    ▶️ Ejecución

    Modo desarrollo:
    npm run dev

    Build y ejecución:
    npm run build
    npm start
    ```

## ⚙️ Descarga de PDFs y manejo de errores  

COMPORTAMIENTO:
 - Las descargs de PDFs detectan errores HTTP 429
 - Se aplican reintentos con backoff exponencial
 - Los fallos persistentes se registran para reintento posterior
 - El scraper continúa procesando otros documentos

## Notas Finales 
Este proyecto fue diseñado para demostrar:
  - Análisis de sistemas legacy
  - Manejo de estado y sesiones
  - Diseño modular y mantenible
  - Tolerancia a fallos en procesos de larga duración
  - Documentación técnica clara