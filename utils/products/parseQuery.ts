import { LanguageEnum } from "@/shop-shared/constants/localization";

export interface IFindProductsQuery {
	lang?: LanguageEnum;
	attrs?: { key: string; values: string[] }[];
	categories?: string[];
	sortField?: string;
	sortOrder?: "asc" | "desc";
	skip?: number;
	limit?: number;
	search?: string;
	priceFrom?: number;
	priceTo?: number;
}
