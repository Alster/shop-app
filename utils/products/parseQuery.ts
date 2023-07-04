import {LanguageEnum} from "@/shop-shared/constants/localization";

export interface IFindProductsQuery {
    lang?: LanguageEnum;
    attrs?: { key: string; values: string[] }[];
    categories?: string[];
    sortField?: string;
    sortOrder?: number;
    skip?: number;
    limit?: number;
    search?: string;
}

export const parseQuery = (query: any) => {}
