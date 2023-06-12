import BagView from "@/app/[locale]/bag/bagView";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";

export default async function BagPage() {
    const currency = getCurrencyStatic();

    const [exchangeState ] = await Promise.all([
        getStaticExchange(),
    ]);

    return <BagView
        exchangeState={exchangeState}
        currency={currency}
    ></BagView>
}
