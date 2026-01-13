// src/types/ResultDocument.ts
export interface ResultDocument {
  id?: string;

  title: string;
  date?: string;
  court?: string;

  // navegación (JSF / legacy)
  detailUrl?: string;
  jsfAction?: string;

  // ✅ NUEVO: presente en PJ / WCM
  pdfUrl?: string;
}
