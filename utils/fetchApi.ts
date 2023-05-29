import * as qs from "qs";

export async function fetchApi<T>(path: string, query: any): Promise<T> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}${path}?${qs.stringify(query)}`, {
        next: { revalidate: +(process.env.NEXT_PUBLIC_FETCH_REVALIDATE_SEC || "") },
    })
    return await response.json();
}
