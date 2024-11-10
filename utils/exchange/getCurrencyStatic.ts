import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { getCookieStatic } from "@/utils/exchange/getCookieStatic";

export async function getCurrencyStatic(): Promise<CurrencyEnum> {
	const currencyStatic = await getCookieStatic("currency");
	return (currencyStatic?.value as CurrencyEnum) || CurrencyEnum.UAH;
}
