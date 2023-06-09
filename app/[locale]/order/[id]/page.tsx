import {useLocale} from "next-intl";
import {fetchOrder} from "@/utils/fetchOrder";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import OrderStatusIndicator from "@/app/[locale]/order/[id]/orderStatus";

export interface Params_OrderId {
    id: string
}

export default async function OrderPage({ params, searchParams }: { params: Params_OrderId, searchParams: any }) {
    const locale = useLocale();
    const currency = getCurrencyStatic();

    const [exchangeState, order] = await Promise.all([
        getStaticExchange(),
        fetchOrder(params.id, locale),
    ]);

    return (
        <OrderStatusIndicator
            order={order}
        ></OrderStatusIndicator>
    )
}
