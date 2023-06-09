import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getCookie} from "@/utils/exchange/cookieClientHelper";

export function getCurrencyClient() {
    const currencyCookie = getCookie("currency");
    return currencyCookie ? currencyCookie as CURRENCY : CURRENCY.UAH;
}
