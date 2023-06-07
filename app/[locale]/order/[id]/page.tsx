import {useLocale} from "next-intl";
import {fetchOrder} from "@/utils/fetchOrder";

export interface Params_OrderId {
    id: string
}

export default async function OrderPage({ params, searchParams }: { params: Params_OrderId, searchParams: any }) {
    const locale = useLocale();

    const order = await fetchOrder(params.id, locale);

    return <div>
        <h1>Order page</h1>
        <p>Order id {order.id}</p>
        <p>First name {order.firstName}</p>
        <p>Last name {order.lastName}</p>
        <p>Phone number {order.phoneNumber}</p>
        <p>Items data {JSON.stringify(order.itemsData, null, 2)}</p>
        <p>Delivery {JSON.stringify(order.delivery, null, 2)}</p>
        <p>Status {order.status}</p>
        <p>Created at {order.createDate}</p>
    </div>
}
