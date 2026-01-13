// src/init/session.ts

export enum SessionStatus {
    READY = "READY",        // Sesión válida, se puede scrapear
    BLOCKED = "BLOCKED",    // Acceso bloqueado (403 / WAF / entorno)
    ERROR = "ERROR",        // Error inesperado
  }
  
  export interface SessionContext {
    status: SessionStatus;
  
    // Información diagnóstica (opcional pero muy útil)
    httpStatus?: number;        // 200, 403, etc.
    message?: string;           // Mensaje humano para logs
  
    // Flags de entorno
    hasCookies?: boolean;       // Se obtuvieron cookies de sesión
    requiresVpn?: boolean;      // Señal para documentación / logs
  }
  
  export interface SessionInitOptions {
    baseUrl: string;            // URL base del portal
    timeoutMs?: number;         // Timeout configurable
  }

  export async function initSession(
    options: SessionInitOptions
  ): Promise<SessionContext> {
    // IMPLEMENTACIÓN VIENE DESPUÉS
    throw new Error("Not implemented");
  }