import {fetchApi} from "@/utils/fetchApi";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";

export async function fetchCategoryTree(lang: string): Promise<CategoriesNodeDto[]> {
    console.log(`Fetching categories with locale ${lang}`)
    return await fetchApi<CategoriesNodeDto[]>("category/tree", {
        lang,
    });
}
