import { ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import { IProductShortDto } from "@/utils/iProductShort.dto";

export type ILikeItem = IProductShortDto;

export interface ILikeItemKeySource {
	productId: string;
	item: ProductItemDto;
}
