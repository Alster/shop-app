import {fetchApi} from "@/utils/fetchApi";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";

export async function fetchCategoryTree(lang: string): Promise<CategoriesNodeDto[]> {
    return await fetchApi<CategoriesNodeDto[]>("category/tree", {
        lang,
    });
}
