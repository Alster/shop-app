import CheckoutView from "@/app/[locale]/checkout/checkoutView";
import {getCookieStatic} from "@/utils/exchange/getCurrencyStatic";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getStaticExchange} from "@/utils/exchange/staticStore";

export default async function CheckoutPage() {
    const currencyStatic = getCookieStatic("currency");
    const currency = currencyStatic?.value as CURRENCY || CURRENCY.UAH;

    const [exchangeState ] = await Promise.all([
        getStaticExchange(),
    ]);

    return <CheckoutView
        exchangeState={exchangeState}
        currency={currency}
    ></CheckoutView>
}
