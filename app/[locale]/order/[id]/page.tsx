import OrderStatusIndicator from "@/app/[locale]/order/[id]/orderStatus";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchOrder } from "@/utils/fetchOrder";

export interface IParametersOrderId {
	id: string;
	locale: string;
}

export default async function OrderPage({ params }: { params: Promise<IParametersOrderId> }) {
	const { locale, id } = await params;
	const currency = await getCurrencyStatic();

	const [exchangeState, order] = await Promise.all([getStaticExchange(), fetchOrder(id, locale)]);

	return <OrderStatusIndicator order={order}></OrderStatusIndicator>;
}
