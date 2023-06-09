import BagView from "@/app/[locale]/bag/bagView";
import {getCookieStatic} from "@/utils/exchange/getCurrencyStatic";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {fetchProduct} from "@/utils/fetchProduct";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {getStaticExchange} from "@/utils/exchange/staticStore";

export default async function BagPage() {
    const currencyStatic = getCookieStatic("currency");
    const currency = currencyStatic?.value as CURRENCY || CURRENCY.UAH;

    const [exchangeState ] = await Promise.all([
        getStaticExchange(),
    ]);
    return <BagView
        exchangeState={exchangeState}
        currency={currency}
    ></BagView>
}
