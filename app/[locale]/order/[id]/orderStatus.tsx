"use client"

import {OrderDto} from "@/shop-shared/dto/order/order.dto";
import {useEffect, useState} from "react";
import {fetchOrderStatus} from "@/utils/fetchOrderStatus";
import {useLocale, useTranslations} from "next-intl";
import {ORDER_STATUS, OrderStatus} from "@/shop-shared/constants/order";
import {CheckIcon, ClockIcon, XMarkIcon} from "@heroicons/react/24/outline";
import {NOVA_POSHTA_DELIVERY_TYPE} from "@/shop-shared/constants/checkout";
import {DeliveryNVCourierDto, DeliveryNVOfficeDto} from "@/shop-shared/dto/order/create-order.dto";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {LanguageEnum} from "@/shop-shared/constants/localization";
import StatusInfo from "@/components/statusInfo";
import {bagStore, createBagItemKey} from "@/utils/bag/bagItemsStorage";
import Link from "next-intl/dist/src/link/react-server";
import * as React from "react";
import {fetchOrderCancel} from "@/utils/fetchOrderCancel";


interface IStatusConfig {
    icon: JSX.Element;
    translateKey: string;
    translateKeyDescription: string;
    textColor: string
}

const CONFIG_WAITING: IStatusConfig = {
    icon: <ClockIcon></ClockIcon>,
    translateKey: "orderStatusWaiting",
    translateKeyDescription: "orderStatusWaitingDescription",
    textColor: "text-blue-400"
}

const CONFIG_SUCCESS: IStatusConfig = {
    icon: <CheckIcon></CheckIcon>,
    translateKey: "orderStatusSuccess",
    translateKeyDescription: "orderStatusSuccessDescription",
    textColor: "text-green-400"
}

const CONFIG_FAILED: IStatusConfig = {
    icon: <XMarkIcon></XMarkIcon>,
    translateKey: "orderStatusFailed",
    translateKeyDescription: "orderStatusFailedDescription",
    textColor: "text-red-400"
}

const StatusesConfig: {[key in OrderStatus]: IStatusConfig} = {
    [ORDER_STATUS.CREATED]: CONFIG_WAITING,
    [ORDER_STATUS.PENDING]: CONFIG_WAITING,
    [ORDER_STATUS.PAID]: CONFIG_SUCCESS,
    [ORDER_STATUS.FINISHED]: CONFIG_SUCCESS,
    [ORDER_STATUS.FAILED]: CONFIG_FAILED,
}

const LANG_TO_LOCALE: {[key in LanguageEnum]: string} = {
    [LanguageEnum.EN]: "en-US",
    [LanguageEnum.UA]: "uk-UA",
    [LanguageEnum.RU]: "ru-RU",
}

export default function OrderStatusIndicator({ order }: { order: OrderDto }){
    const t = useTranslations('OrderStatusPage');
    const tCheckout = useTranslations('CheckoutPage');
    const locale = useLocale();
    const [status, setStatus] = useState(order.status);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const queueFetch = () => {
        const timeoutId = setTimeout(async () => {
            const status = await fetchOrderStatus(order.id, locale);
            setStatus(status);

            if (status === ORDER_STATUS.PAID) {
                const alreadyBuyItems = order.itemsData.map(item => createBagItemKey(item));
                bagStore.removeFromStore(...alreadyBuyItems);
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

    const config = StatusesConfig[status];

    function InfoBlock({title, children }: { title: string, children: any }){
        return <div className="flex flex-col p-4">
            <div className="font-extrabold text-center">{title}</div>
            <div>{children}</div>
        </div>
    }

    function InfoRow({ title, value }: { title: string, value: string }){
        return <div className="flex font-mono">
            <div className="w-1/2 text-right pr-2">{title}</div>
            <div className="w-1/2 text-left pl-2">
                <span className="bg-gray-200 dark:bg-gray-800">{value}</span>
            </div>
        </div>
    }

    return (
        <div className="flex flex-col items-center justify-centent">
            <div className="order-status">

                {/*Status*/}
                <div className="flex flex-col text-center">
                    <StatusInfo
                        iconConfig={{
                            icon: config.icon,
                            textColor: config.textColor,
                        }}
                        title={t(config.translateKey)}
                        description={t(config.translateKeyDescription)}
                    ></StatusInfo>
                </div>

                {/*Contact information*/}
                <InfoBlock title={tCheckout('contactInfo')}>
                    <InfoRow title={tCheckout('firstName')}  value={order.firstName}></InfoRow>
                    <InfoRow title={tCheckout('lastName')} value={order.lastName}></InfoRow>
                    <InfoRow title={tCheckout('phoneNumber')} value={order.phoneNumber}></InfoRow>
                </InfoBlock>

                {/*Delivery information*/}
                {order.delivery.whereToDeliver === NOVA_POSHTA_DELIVERY_TYPE.OFFICE && (
                    <InfoBlock title={tCheckout('delivery')}>
                        <InfoRow title={tCheckout('deliveryCity')}  value={(order.delivery.data as DeliveryNVOfficeDto).cityName}></InfoRow>
                        <InfoRow title={tCheckout('whereToDeliver:office')}  value={(order.delivery.data as DeliveryNVOfficeDto).officeName}></InfoRow>
                    </InfoBlock>
                )}
                {order.delivery.whereToDeliver === NOVA_POSHTA_DELIVERY_TYPE.COURIER && (
                    <InfoBlock title={tCheckout('delivery')}>
                        <InfoRow title={tCheckout('deliveryCity')}  value={(order.delivery.data as DeliveryNVCourierDto).cityName}></InfoRow>
                        <InfoRow title={tCheckout('street')}  value={(order.delivery.data as DeliveryNVCourierDto).street}></InfoRow>
                        <InfoRow title={tCheckout('building')}  value={(order.delivery.data as DeliveryNVCourierDto).building}></InfoRow>
                        <InfoRow title={tCheckout('room')}  value={(order.delivery.data as DeliveryNVCourierDto).room}></InfoRow>
                    </InfoBlock>
                )}

                {/*Order info*/}
                <InfoBlock title={t('orderInfo')}>
                    <InfoRow title={t('orderInfo:totalPrice')}  value={
                        formatPrice(
                            moneySmallToBig(
                                order.totalPrice
                            ),
                            order.currency
                        )
                    }></InfoRow>
                    <InfoRow title={t('orderInfo:dateCreated')} value={new Date(order.createDate).toLocaleString(LANG_TO_LOCALE[locale as LanguageEnum])}></InfoRow>
                </InfoBlock>

                {/*Cancel*/}
                {status === ORDER_STATUS.PENDING && (
                    <button
                        onClick={async () => {
                            await fetchOrderCancel(order.id, locale);
                            queueFetch();
                        }}
                        className="
                        flex justify-center w-full h-12 uppercase font-medium tracking-wider
                         dark:bg-slate-200 dark:text-black
                         bg-slate-800 text-white
                     ">
                        <span className="mt-3 ml-2">
                            {`${t("bCancelOrder")}`}
                        </span>
                    </button>
                )}
            </div>
        </div>
    )
}
