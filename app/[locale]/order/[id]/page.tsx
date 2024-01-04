import OrderStatusIndicator from "@/app/[locale]/order/[id]/orderStatus";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchOrder } from "@/utils/fetchOrder";

export interface IParametersOrderId {
	id: string;
	locale: string;
}

export default async function OrderPage({ params }: { params: IParametersOrderId }) {
	const currency = getCurrencyStatic();

	const [exchangeState, order] = await Promise.all([
		getStaticExchange(),
		fetchOrder(params.id, params.locale),
	]);

	return <OrderStatusIndicator order={order}></OrderStatusIndicator>;
}
