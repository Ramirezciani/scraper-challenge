// src/client/http.ts

import axios, { AxiosInstance } from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

export interface HttpClientOptions {
    timeoutMs?: number;
}

export function createHttpClient(
    options?: HttpClientOptions
): AxiosInstance {
    const jar = new CookieJar();

    const client = wrapper(
        axios.create({
            timeout: options?.timeoutMs ?? 15000,
            withCredentials: true,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "es-ES,es;q=0.9",
                "Connection": "keep-alive",
            },
            validateStatus: () => true,
        } as any)
    );

    // axios-cookiejar-support extiende axios en runtime, no en tipos
    (client.defaults as any).jar = jar;

    return client;
}
