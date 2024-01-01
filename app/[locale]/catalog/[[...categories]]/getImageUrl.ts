import { ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import getProductImageUrl from "@/shop-shared/utils/getProductImageUrl";
import ImagePostfixType from "@/shop-shared/utils/imagePostfixType";

const getImageUrl = (item: ProductItemDto, postfix: ImagePostfixType, number?: number) => {
	const imageId = item.images[number || 0];
	if (!imageId) {
		return "";
	}
	return getProductImageUrl(item.sku, imageId, postfix);
};

export default getImageUrl;
