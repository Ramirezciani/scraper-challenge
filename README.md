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
src/
├── index.ts
│   # Orquestador principal del scraper.
│   # Define el flujo:
│   # 1) Modo dry-run con HTML mock
│   # 2) Inicialización de sesión
│   # 3) Fallback a scraping real (WCM)
│   # 4) Persistencia de resultados y PDFs
│
├── client/
│   └── http.ts
│       # Cliente HTTP basado en axios
│       # - Manejo de cookies (cookie-jar)
│       # - Headers comunes
│       # - Retry base (para requests generales)
│
├── init/
│   └── session.ts
│       # Inicializa el contexto de scraping
│       # - Detecta bloqueos HTTP (403)
│       # - Determina si usar JSF o fallback WCM
│       # - Centraliza la lógica de arranque
│
├── crawler/
│   ├── mock/
│   │   # Implementación MOCK (offline / testing)
│   │   # Usada para:
│   │   # - Desarrollo
│   │   # - Validación de extractores
│   │   # - Cumplir dry-run solicitado en el desafío
│   │
│   │   ├── extractorResult.ts
│   │   │   # Extrae resultados desde HTML mock
│   │   │   # Simula listado de documentos
│   │   │
│   │   ├── extractorDetail.ts
│   │   │   # Extrae metadata y PDF desde HTML mock
│   │   │
│   │   ├── paginator.ts
│   │   │   # Simula navegación entre resultados/detalles
│   │   │
│   │   └── pdfDownloader.ts
│   │       # Descarga PDFs mock
│   │       # Mantiene misma interfaz que versión real
│   │
│   └── pj/
│       # Implementación REAL contra sitio público del PJ (WCM)
│       # Fuente:
│       # https://www.pj.gob.pe/wps/wcm/connect/cij-juris/...
│
│       ├── extractorResult.pj.ts
│       │   # Extrae filas reales desde tablas PJ
│       │   # - Número de Recurso
│       │   # - Distrito
│       │   # - Sala
│       │   # - Fecha
│       │   # - URL del PDF
│       │
│       ├── extractorDetail.pj.ts
│       │   # Extrae metadata adicional desde página detalle PJ
│       │   # (cuando aplica)
│       │
│       ├── paginator.pj.ts
│       │   # Navegación real (cuando hay múltiples páginas)
│       │   # Preparado para extender paginación WCM
│       │
│       ├── pdfDownloader.pj.ts
│       │   # Descarga PDFs reales
│       │   # - Manejo de errores 429
│       │   # - Retry con backoff exponencial
│       │   # - Registro de fallos
│       │
│       └── wcmCrawler.ts
│           # Crawler principal WCM
│           # - Fetch inicial
│           # - Uso de extractorResult.pj
│           # - Orquestación de descargas de PDFs
│
├── storage/
│   └── writer.ts
│       # Persistencia estructurada
│       # - Guarda resultados en JSON
│       # - Organiza salida en output/json
│
├── types/
│   ├── ResultDocument.ts
│   │   # Modelo de documento en listado
│   │
│   └── DetailDocument.ts
│       # Modelo de documento detallado + PDF
│
└── utils/
    └── sleep.ts
        # Utilidad de delay
        # Usada para:
        # - Backoff exponencial
        # - Protección contra rate limiting
        
├── sample-result.html
      # Mockup Html
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

# Notas finales

- Este proyecto fue diseñado para demostrar competencias clave en contextos reales de scraping y sistemas legacy, incluyendo:
    - Análisis y adaptación a arquitecturas web heredadas (JSF / WCM).
    - Manejo explícito de estado, sesiones y bloqueos del servidor.
    - Diseño modular, extensible y mantenible.
    - Tolerancia a fallos en procesos de larga duración.
    - Separación clara entre lógica de extracción, navegación y persistencia.
    - Documentación técnica clara, orientada a evaluadores y futuros mantenedores.

# Conclusión
 - Este scraper es capaz de:
    Navegar sitios web legacy del Poder Judicial del Perú.
    Extraer información estructurada desde páginas de resultados y detalle.
    Descargar documentos PDF reales desde el sitio público accesible (WCM).
    Operar de forma resiliente frente a bloqueos, errores de red y limitaciones de rate-limit.
    Ejecutarse tanto en modo dry-run (HTML mock) como contra datos reales, garantizando trazabilidad y capacidad de prueba.

  - La arquitectura fue pensada para que el scraper pueda llegar a procesar la totalidad del contenido disponible si se deja ejecutando el tiempo suficiente, cumpliendo con los requerimientos del desafío y con estándares de calidad esperados en entornos productivos.