import { IProductShortDto } from "@/utils/IProductShort.dto";

export type ILikeItem = IProductShortDto;

export interface ILikeItemKeySource {
	productId: string;
	attributes: Record<string, string[]>;
}
