import * as qs from "qs";

export enum ParseMethod {
    JSON = "json",
    TEXT = "text",
    NONE = "none",
}

export interface IFetchOptions {
    parseMethod?: ParseMethod;
    method?: string;
}

const DEFAULT_OPTIONS: IFetchOptions = {
    parseMethod: ParseMethod.JSON,
    method: "GET",
}

export async function fetchApi<T>(path: string, query: any, options: IFetchOptions = {}): Promise<T> {
    options = { ...DEFAULT_OPTIONS, ...options };
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}${path}?${qs.stringify(query)}`, {
        next: { revalidate: +(process.env.NEXT_PUBLIC_FETCH_REVALIDATE_SEC || "") },
        method: options.method,
    })

    if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
    }

    if (options.parseMethod === ParseMethod.JSON) {
        return await response.json();
    } else if (options.parseMethod === ParseMethod.TEXT) {
        return await response.text() as T;
    } else return null as T;
}
