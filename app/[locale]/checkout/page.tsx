import CheckoutView from "@/app/[locale]/checkout/checkoutView";
import {getCookieStatic} from "@/utils/exchange/getCookieStatic";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";

export default async function CheckoutPage() {
    const currency = getCurrencyStatic();

    const [exchangeState ] = await Promise.all([
        getStaticExchange(),
    ]);

    return <CheckoutView
        exchangeState={exchangeState}
        currency={currency}
    ></CheckoutView>
}
