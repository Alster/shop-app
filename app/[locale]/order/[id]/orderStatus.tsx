"use client"

import {OrderDto} from "@/shop-shared/dto/order/order.dto";
import {useEffect, useState} from "react";
import {fetchOrderStatus} from "@/utils/fetchOrderStatus";
import {useLocale} from "next-intl";
import {ORDER_STATUS, OrderStatus} from "@/shop-shared/constants/order";
import {createBagItemKey, removeFromBagStore} from "@/utils/bag/staticStore";

export default function OrderStatusIndicator({ order }: { order: OrderDto }){
    const locale = useLocale();
    const [status, setStatus] = useState(order.status);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const queueFetch = () => {
        const timeoutId = setTimeout(async () => {
            const status = await fetchOrderStatus(order.id, locale);
            setStatus(status);

            if (status === ORDER_STATUS.PAID) {
                const alreadyBuyItems = order.itemsData.map(item => createBagItemKey(item));
                removeFromBagStore(...alreadyBuyItems);
            }

            if (([
                ORDER_STATUS.CREATED,
                ORDER_STATUS.PENDING,
            ] as OrderStatus[]).includes(status)){
                queueFetch();
            }
        }, 1000);
        setTimeoutId(timeoutId);
    }
    useEffect(() => {
        queueFetch();
        return () => {
            if (timeoutId === null){
                return;
            }
            clearTimeout(timeoutId);
        }
    }, []);

    return (
        <div>
            <h1>OrderStatus</h1>
            <div>
                {status}
            </div>
        </div>
    )
}
