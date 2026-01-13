import { AxiosInstance } from "axios";
import { ResultDocument } from "../../types/ResultDocument";

/**
 * Navegador JSF.
 * - Maneja ViewState
 * - Maneja POSTs de navegación
 * - No parsea HTML
 * - No descarga PDFs
 */
export class Paginator {
    constructor(
        private readonly client: AxiosInstance,
        private readonly baseUrl: string
    ) { }

    /**
     * Navega desde la página de resultados
     * y devuelve los HTML de cada página de detalle.
     *
     * NOTA:
     * - Implementación real depende del ViewState
     * - Aquí dejamos el contrato explícito
     */
    async *iterateDetails(
        results: ResultDocument[]
    ): AsyncGenerator<string> {
        for (const item of results) {
            // TODO:
            // 1. Construir POST JSF usando jsfAction / ViewState
            // 2. Ejecutar request
            // 3. Yield HTML de detalle

            // placeholder defensivo
            if (!item.detailUrl) continue;

            const response = await this.client.get(item.detailUrl);
            yield response.data;
        }
    }
}
