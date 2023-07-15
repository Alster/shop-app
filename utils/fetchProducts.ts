import { ProductListResponseDto } from "@/shop-shared/dto/product/product-list.response.dto";
import { fetchApi } from "@/utils/fetchApi";
import { IFindProductsQuery } from "@/utils/products/parseQuery";

export async function fetchProducts(
	lang: string,
	query: IFindProductsQuery,
): Promise<ProductListResponseDto> {
	console.log(`Fetching products with locale ${lang}`);
	return await fetchApi<ProductListResponseDto>("product/list", { ...query, lang });
}
