import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {fetchApi} from "@/utils/fetchApi";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";

export async function fetchAttributes(lang: string): Promise<AttributeDto[]> {
    return await fetchApi<AttributeDto[]>("product/attribute/list", {
        lang,
    });
}
