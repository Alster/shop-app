import * as qs from "qs";

import { buildUrl } from "@/shop-shared/utils/buildUrl";

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

function getVariable(
	fieldName: "NEXT_PUBLIC_APP_API_URL" | "NEXT_PUBLIC_FETCH_REVALIDATE_SEC",
): string | undefined {
	return process.env[fieldName];
}

export async function fetchApi<T>(
	path: string,
	query: unknown = {},
	options: IFetchOptions = {},
): Promise<T> {
	options = { ...DEFAULT_OPTIONS, ...options };
	const url =
		buildUrl(getVariable("NEXT_PUBLIC_APP_API_URL") ?? "http://localhost", path) +
		`?${qs.stringify(query)}`;
	console.log(`fetchApi: ${url}`);
	const response = await fetch(url, {
		next: { revalidate: +(getVariable("NEXT_PUBLIC_FETCH_REVALIDATE_SEC") || "") },
		method: options.method,
	});

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
