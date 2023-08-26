import { ProductDto } from "@/shop-shared/dto/product/product.dto";
import getProductImageUrl from "@/shop-shared/utils/getProductImageUrl";
import ImagePostfixType from "@/shop-shared/utils/imagePostfixType";

const getImageUrl = (
	product: ProductDto,
	postfix: ImagePostfixType,
	color: string,
	number?: number,
) => {
	const imageId = product.imagesByColor[color][number || 0];
	if (!imageId) {
		return "";
	}
	return getProductImageUrl(product.id, imageId, postfix);
};

export default getImageUrl;
