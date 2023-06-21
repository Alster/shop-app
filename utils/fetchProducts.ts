import {fetchApi} from "@/utils/fetchApi";
import {ProductListResponseDto} from "@/shop-shared/dto/product/product-list.response.dto";
import {IFindProductsQuery} from "@/utils/products/parseQuery";

export async function fetchProducts(lang: string, query: IFindProductsQuery): Promise<ProductListResponseDto> {
    return await fetchApi<ProductListResponseDto>("product/list", query);
}
