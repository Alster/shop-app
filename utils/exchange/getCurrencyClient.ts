import { CurrencyEnum } from "../shop-shared/constants/exchange";
import { getCookie } from "./cookieClientHelper";

export function getCurrencyClient(): CurrencyEnum {
	const currencyCookie = getCookie("currency");
	return currencyCookie ? (currencyCookie as CurrencyEnum) : CurrencyEnum.UAH;
}
