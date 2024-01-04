import { useLocale } from "next-intl";

import OrderStatusIndicator from "@/app/[locale]/order/[id]/orderStatus";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchOrder } from "@/utils/fetchOrder";

export interface IParametersOrderId {
	id: string;
}

export default async function OrderPage({ params }: { params: IParametersOrderId }) {
	const locale = useLocale();
	const currency = getCurrencyStatic();

	const [exchangeState, order] = await Promise.all([
		getStaticExchange(),
		fetchOrder(params.id, locale),
	]);

	return <OrderStatusIndicator order={order}></OrderStatusIndicator>;
}
