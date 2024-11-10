import { CurrencyEnum } from "@/shop-shared/constants/exchange";

import { getCookie } from "./cookieClientHelper";

export async function getCurrencyClient(): Promise<CurrencyEnum> {
	const currencyCookie = await getCookie("currency");
	return currencyCookie ? (currencyCookie as CurrencyEnum) : CurrencyEnum.UAH;
}
