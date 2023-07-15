import { useLocale } from "next-intl";

import OrderStatusIndicator from "@/app/[locale]/order/[id]/orderStatus";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchOrder } from "@/utils/fetchOrder";
import ISearchParameters from "@/utils/products/iSearchParameters";

export interface IParametersOrderId {
	id: string;
}

export default async function OrderPage({
	params,
	searchParams,
}: {
	params: IParametersOrderId;
	searchParams: ISearchParameters;
}) {
	const locale = useLocale();
	const currency = getCurrencyStatic();

	const [exchangeState, order] = await Promise.all([
		getStaticExchange(),
		fetchOrder(params.id, locale),
	]);

	return <OrderStatusIndicator order={order}></OrderStatusIndicator>;
}
