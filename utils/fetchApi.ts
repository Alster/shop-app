import * as qs from "qs";

export enum ParseMethodEnum {
	JSON = "json",
	TEXT = "text",
	NONE = "none",
}

export interface IFetchOptions {
	parseMethod?: ParseMethodEnum;
	method?: string;
}

const DEFAULT_OPTIONS: IFetchOptions = {
	parseMethod: ParseMethodEnum.JSON,
	method: "GET",
};

export async function fetchApi<T>(
	path: string,
	query: unknown = {},
	options: IFetchOptions = {},
): Promise<T> {
	options = { ...DEFAULT_OPTIONS, ...options };
	const response = await fetch(
		`${process.env.NEXT_PUBLIC_APP_API_URL}${path}?${qs.stringify(query)}`,
		{
			next: { revalidate: +(process.env.NEXT_PUBLIC_FETCH_REVALIDATE_SEC || "") },
			method: options.method,
		},
	);

	if (!response.ok) {
		throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
	}

	if (options.parseMethod === ParseMethodEnum.JSON) {
		return await response.json();
	} else if (options.parseMethod === ParseMethodEnum.TEXT) {
		return (await response.text()) as T;
	}
	return undefined as T;
}
