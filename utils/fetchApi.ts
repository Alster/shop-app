import * as qs from "qs";

export enum ParseMethod {
    JSON = "json",
    TEXT = "text",
}

export interface IFetchOptions {
    parseMethod?: ParseMethod;
}

const DEFAULT_OPTIONS: IFetchOptions = {
    parseMethod: ParseMethod.JSON,
}

export async function fetchApi<T>(path: string, query: any, options: IFetchOptions = {}): Promise<T> {
    options = { ...DEFAULT_OPTIONS, ...options };
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}${path}?${qs.stringify(query)}`, {
        next: { revalidate: +(process.env.NEXT_PUBLIC_FETCH_REVALIDATE_SEC || "") },
    })

    if (options.parseMethod === ParseMethod.JSON) {
        return await response.json();
    } else {
        return await response.text() as T;
    }
}
