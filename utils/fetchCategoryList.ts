import {fetchApi} from "@/utils/fetchApi";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";

export async function fetchCategoryList(lang: string): Promise<CategoryDto[]> {
    return await fetchApi<CategoryDto[]>("category/list", {
        lang,
    });
}
