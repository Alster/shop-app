import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { fetchApi } from "@/utils/fetchApi";

export async function fetchAttributes(lang: string): Promise<AttributeDto[]> {
	console.log(`Fetching attributes with locale ${lang}`);
	return await fetchApi<AttributeDto[]>("product/attribute/list", {
		lang,
	});
}
