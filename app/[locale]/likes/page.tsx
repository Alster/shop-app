import { unstable_setRequestLocale } from "next-intl/server";
import * as React from "react";

import LikesView from "@/app/[locale]/likes/likesView";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";

export default async function LikesPage({ params }: { params: { locale: string } }) {
	unstable_setRequestLocale(params.locale);
	const currency = getCurrencyStatic();

	const [exchangeState] = await Promise.all([getStaticExchange()]);

	return <LikesView exchangeState={exchangeState} currency={currency}></LikesView>;
}
