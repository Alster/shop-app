import * as React from "react";
import LikesView from "@/app/[locale]/likes/likesView";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";

export default async function LikesPage() {
    const currency = getCurrencyStatic();

    const [exchangeState ] = await Promise.all([
        getStaticExchange(),
    ]);

    return <LikesView
        exchangeState={exchangeState}
        currency={currency}
    ></LikesView>
}
