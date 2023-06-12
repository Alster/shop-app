"use client"

import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import Image from "next/image";
import {IBagItem} from "@/utils/bag/IBagItem";
import {TrashIcon, ShoppingBagIcon} from "@heroicons/react/24/outline";
import {ReactElement} from "react";
import {useTranslations} from "next-intl";
import Link from "next-intl/link";
import HorizontalLine from "@/components/horizontalLine";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {bagStore, useBagStore} from "@/utils/bag/bagItemsStorage";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import StatusInfo from "@/components/statusInfo";
import * as React from "react";

export default function BagView({ exchangeState, currency }: {
    exchangeState: ExchangeState,
    currency: CURRENCY,
}) {
    const t = useTranslations('BagPage');
    const bagItems = useBagStore();

    if (!Object.keys(bagItems).length) {
        return <StatusInfo
            iconConfig={{
                icon: <ShoppingBagIcon></ShoppingBagIcon>,
                textColor: "text-white-400",
                backgroundColor: "bg-gray-400"
            }}
            title={t("emptyBag")}
            description={t("emptyBagDescription")}
        ></StatusInfo>
    }

    const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);

    const drawSize = (bagItem: IBagItem) => {
        const sizeAttr = Object.entries(bagItem.attributes)
            .find(([key]) => Array.from(SIZE_ATTRS.values()).includes(key as ATTRIBUTES));

        if (!sizeAttr) {
            return null;
        }

        return sizeAttr[1].map(v => v.toUpperCase()).join(", ");
    };

    const drawItem = (key: string, bagItem: IBagItem) => {
        const productHref = `/product/${bagItem.productId}`;
        return <div key={key} className="p-1 m-3 flex">
            <Link
                href={productHref}
            >
                <Image
                    className="rounded-2xl"
                    src="https://picsum.photos/200/200"
                    alt={bagItem.title}
                    width={200}
                    height={200}
                    loading="lazy"
                />
            </Link>
            <div className="pl-4 w-full flex flex-wrap flex-col">
                <div className="flex-auto flex flex-wrap">
                    <div className="flex-auto">
                        <Link
                            className="font-semibold text-lg"
                            href={productHref}
                        >{bagItem.title}</Link>
                    </div>
                    <div>
                        <button
                            className=""
                            onClick={() => {
                                bagStore.removeFromStore(key)
                            }}
                        ><TrashIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="flex-auto">
                        <div className="text-md flex text-slate-500">
                            <div className="w-20 text-sm">{t("color")}:</div>
                            <div
                                style={{backgroundColor: bagItem.attributes[ATTRIBUTES.COLOR][0]}}
                                className="ml-2 w-6 h-6 border-2 border-gray-300 dark:border-gray-700"
                            ></div>
                        </div>
                        <div className="flex">
                            <span className="w-20 text-slate-500 text-sm">{t("size")}</span>
                            <span className="font-bold pl-2">{drawSize(bagItem)}</span>
                        </div>
                    </div>
                    <div className="font-bold text-lg flex flex-wrap flex-col">
                        <div className="flex-auto"></div>
                        <div className="flex">
                            {formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, bagItem.price, exchangeState)), currency)}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }

    return <div className="flex flex-col lg:flex-row">
        <div className="flex-auto lg:px-8">
            {Object
                .entries(bagItems)
                .map(([key, bagItem]) => drawItem(key, bagItem))
                .reduce((prev, elem) => {
                    if (prev.length > 0) {
                        prev.push(<HorizontalLine key={Math.random()}></HorizontalLine>);
                    }
                    prev.push(elem);
                    return prev;
                }, [] as ReactElement[])
            }
        </div>
        <div className="m-2 p-2 bg-gray-100 dark:bg-gray-900 lg:w-1/3">
            <div className="text-lg flex">
                <div className="flex-auto">{t("totalPrice")}:</div>
                <div className="font-bold">{
                    formatPrice(
                        moneySmallToBig(
                            doExchange(
                                CURRENCY.UAH,
                                currency,
                                sum(Object.values(bagItems).map(item => item.price as number)),
                                exchangeState
                            )
                        ),
                        currency
                    )
                }</div>
            </div>
            <HorizontalLine></HorizontalLine>
            <Link
                href="/checkout"
                className="
                                flex justify-center w-full h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             ">
                <span className="mt-3 ml-2">
                    {`${t("bCheckout")}`}
                </span>
            </Link>
        </div>
    </div>
}
