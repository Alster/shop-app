import { AttributesEnum } from "@/shop-shared/constants/attributesEnum";
import { ProductListResponseDto } from "@/shop-shared/dto/product/productList.response.dto";
import { fetchApi } from "@/utils/fetchApi";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

export async function fetchProducts(
	lang: string,
	query: IFindProductsQuery,
): Promise<ProductListResponseDto> {
	console.log(`Fetching products with locale ${lang}`);
	const response = await fetchApi<ProductListResponseDto>("product/list", { ...query, lang });
	response.products = response.products.map((product) => {
		const attributeColor = product.attrs[AttributesEnum.COLOR];
		product.selectedColor = attributeColor ? attributeColor[0] : "";
		return product;
	});
	return response;
}
