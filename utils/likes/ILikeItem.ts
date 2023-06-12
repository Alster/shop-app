import {IProductShortDto} from "@/utils/IProductShort.dto";

export interface ILikeItem extends IProductShortDto {}

export interface ILikeItemKeySource {
    productId: string;
    attributes: Record<string, string[]>;
}
