// src/utils/sleep.ts

/**
 * Pausa la ejecución por N milisegundos.
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calcula un delay con backoff exponencial.
 *
 * Ejemplo:
 * attempt = 0 -> baseMs
 * attempt = 1 -> baseMs * 2
 * attempt = 2 -> baseMs * 4
 */
export function exponentialBackoff(
    attempt: number,
    baseMs: number = 500,
    maxMs: number = 30_000
): number {
    const delay = baseMs * Math.pow(2, attempt);
    return Math.min(delay, maxMs);
}
