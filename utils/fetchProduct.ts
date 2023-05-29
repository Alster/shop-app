import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {fetchApi} from "@/utils/fetchApi";

export async function fetchProduct(id: string, lang: string): Promise<ProductDto> {
    return await fetchApi<ProductDto>(`product/get/${id}`, {
        lang,
    });
}
