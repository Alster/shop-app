import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { getCookieStatic } from "@/utils/exchange/getCookieStatic";

export function getCurrencyStatic() {
	const currencyStatic = getCookieStatic("currency");
	return (currencyStatic?.value as CurrencyEnum) || CurrencyEnum.UAH;
}
