import {ProductAttributesDto} from "@/shop-shared/dto/product/product.dto";
import {MoneySmall} from "@/shop-shared/dto/primitiveTypes";

export interface IBagItem {
    productId: string;
    title: string;
    price: MoneySmall;
    image: string;
    attributes: ProductAttributesDto;
    quantity: number;
}
