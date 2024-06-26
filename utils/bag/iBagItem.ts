import { IProductShortDto } from "@/utils/iProductShort.dto";

export type IBagItem = IProductShortDto;

export interface IBagItemKeySource {
	productId: string;
	item: { sku: string };
}
