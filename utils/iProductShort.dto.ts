import { MoneySmall } from "@/shop-shared/dto/primitiveTypes";
import { ProductItemDto } from "@/shop-shared/dto/product/product.dto";

export interface IProductShortDto {
	productId: string;
	publicId: string;
	title: string;
	price: MoneySmall;
	item: ProductItemDto;
}
