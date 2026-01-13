import { AxiosInstance } from "axios";
import { createHttpClient } from "../client/http";

export enum SessionStatus {
    READY = "READY",
    BLOCKED = "BLOCKED",
    ERROR = "ERROR",
}

export interface SessionContext {
    status: SessionStatus;
    httpStatus?: number;
    message?: string;
    hasCookies?: boolean;
    requiresVpn?: boolean;
}

export interface SessionInitOptions {
    baseUrl: string;
    timeoutMs?: number;
}

export async function initSession(
    options: SessionInitOptions
): Promise<SessionContext> {
    let client: AxiosInstance;

    try {
        client = createHttpClient({
            timeoutMs: options.timeoutMs,
        });

        const response = await client.get(options.baseUrl);
        const status = response.status;

        const setCookieHeader = response.headers?.["set-cookie"];
        const hasCookies =
            Array.isArray(setCookieHeader) && setCookieHeader.length > 0;

        if (status === 200) {
            return {
                status: SessionStatus.READY,
                httpStatus: status,
                hasCookies,
                message: "Session initialized successfully",
            };
        }

        if (status === 403) {
            return {
                status: SessionStatus.BLOCKED,
                httpStatus: status,
                hasCookies,
                requiresVpn: true,
                message: "Access blocked (HTTP 403)",
            };
        }

        return {
            status: SessionStatus.ERROR,
            httpStatus: status,
            hasCookies,
            message: `Unexpected HTTP status: ${status}`,
        };
    } catch (error: any) {
        return {
            status: SessionStatus.ERROR,
            message: error?.message ?? "Unknown error",
        };
    }
}
