import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {fetchApi} from "@/utils/fetchApi";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";

export async function fetchCategoryList(lang: string): Promise<CategoryDto[]> {
    return await fetchApi<CategoryDto[]>("category/list", {
        lang,
    });
}
