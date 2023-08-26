import { AttributesEnum } from "@/app/constants";
import { LanguageEnum } from "@/shop-shared/constants/localization";
import { MoneySmall } from "@/shop-shared/dto/primitiveTypes";

export interface IFindProductsQuery {
	lang?: LanguageEnum;
	attrs?: { key: string; values: string[] }[];
	categories?: string[];
	sortField?: string;
	sortOrder?: "asc" | "desc";
	skip?: number;
	limit?: number;
	search?: string;
	priceFrom?: MoneySmall;
	priceTo?: MoneySmall;
	[AttributesEnum.COLOR]?: string;
	[AttributesEnum.SIZE]?: string;
	[AttributesEnum.SIZE_SHOES]?: string;
}
