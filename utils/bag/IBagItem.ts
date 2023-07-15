import { IProductShortDto } from "@/utils/IProductShort.dto";

export type IBagItem = IProductShortDto;

export interface IBagItemKeySource {
	productId: string;
	attributes: Record<string, string[]>;
}
