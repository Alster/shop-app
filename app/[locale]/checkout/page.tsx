import { setRequestLocale } from "next-intl/server";
import React from "react";

import CheckoutView from "@/app/[locale]/checkout/checkoutView";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";

export default async function CheckoutPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	const currency = await getCurrencyStatic();

	const [exchangeState] = await Promise.all([getStaticExchange()]);

	return <CheckoutView exchangeState={exchangeState} currency={currency}></CheckoutView>;
}
