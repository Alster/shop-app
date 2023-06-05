import {ProductAttributesDto} from "@/shop-shared/dto/product/product.dto";

export interface IBagItem {
    id: string;
    title: string;
    price: number;
    image: string;
    attributes: ProductAttributesDto;
    quantity: number;
}
