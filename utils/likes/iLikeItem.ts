import { IProductShortDto } from "@/utils/iProductShort.dto";

export type ILikeItem = IProductShortDto;

export interface ILikeItemKeySource {
	productId: string;
	attributes: Record<string, string[]>;
}
