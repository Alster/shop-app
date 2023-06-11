import {useLocale} from "next-intl";
import {fetchOrder} from "@/utils/fetchOrder";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";

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

    return <div>
        <h1>Order page</h1>
        <p>Order id {order.id}</p>
        <p>First name {order.firstName}</p>
        <p>Last name {order.lastName}</p>
        <p>Phone number {order.phoneNumber}</p>
        <p>Items data {JSON.stringify(order.itemsData, null, 2)}</p>
        <p>Delivery {JSON.stringify(order.delivery, null, 2)}</p>
        <p>Total price {
            formatPrice(
                moneySmallToBig(
                    order.totalPrice
                ),
                currency
            )
        }</p>
        <p>Status {order.status}</p>
        <p>Created at {order.createDate}</p>
    </div>
}
