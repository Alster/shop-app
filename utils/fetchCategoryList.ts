import { CategoryDto } from "@/shop-shared/dto/category/category.dto";
import { fetchApi } from "@/utils/fetchApi";

export async function fetchCategoryList(lang: string): Promise<CategoryDto[]> {
	return await fetchApi<CategoryDto[]>("category/list", {
		lang,
	});
}
