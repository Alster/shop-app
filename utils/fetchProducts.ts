import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {fetchApi} from "@/utils/fetchApi";

export type ProductsListType = ProductDto[];

export async function fetchProducts(lang: string): Promise<ProductsListType> {
    const data = await fetchApi<{ products: ProductsListType }>("product/list", {
        lang,
    });
    return data.products;
}
