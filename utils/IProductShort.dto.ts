import {MoneySmall} from "@/shop-shared/dto/primitiveTypes";
import {ProductAttributesDto} from "@/shop-shared/dto/product/product.dto";

export interface IProductShortDto {
    productId: string;
    title: string;
    price: MoneySmall;
    image: string;
    attributes: ProductAttributesDto;
    quantity: number;
}
