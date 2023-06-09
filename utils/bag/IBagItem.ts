import {IProductShortDto} from "@/utils/IProductShort.dto";

export interface IBagItem extends IProductShortDto {}

export interface IBagItemKeySource {
    productId: string;
    attributes: Record<string, string[]>;
}
