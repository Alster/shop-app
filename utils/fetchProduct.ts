import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {fetchApi} from "@/utils/fetchApi";

export async function fetchProduct(publicId: string, lang: string): Promise<ProductDto | null> {
    try {
        return await fetchApi<ProductDto>(`product/get/public/${publicId}`, {
            lang,
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}
