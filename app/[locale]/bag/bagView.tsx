"use client"

import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import Image from "next/image";
import {IBagItem} from "@/utils/bag/IBagItem";
import {MinusSmallIcon, PlusSmallIcon, ShoppingBagIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ReactElement, useReducer} from "react";
import {useFormatter, useTranslations} from "next-intl";
import Link from "next-intl/link";
import HorizontalLine from "@/components/horizontalLine";
import {ExchangeState} from "@/utils/exchange/helpers";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {formatPrice} from "@/utils/exchange/formatPrice";
import {doExchange} from "@/utils/exchange/doExchange";
import {useBagStore, removeFromBagStore} from "@/utils/bag/staticStore";

export default function BagView({ exchangeState, currency }: {
    exchangeState: ExchangeState,
    currency: CURRENCY,
}) {
    const t = useTranslations('BagPage');
    const format = useFormatter();
    const bagItems = useBagStore();

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
        return <div key={key} className="p-1 m-3 flex">
            <Image
                className="rounded-2xl"
                src="https://picsum.photos/200/200"
                alt={bagItem.title}
                width={200}
                height={200}
                loading="lazy"
            />
            <div className="pl-4 w-full flex flex-wrap flex-col">
                <div className="flex-auto flex flex-wrap">
                    <div className="flex-auto">
                        <div className="font-semibold text-lg">{bagItem.title}</div>
                    </div>
                    <div>
                        <button
                            className=""
                            onClick={() => {
                                removeFromBagStore(key)
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
                            {formatPrice(doExchange(CURRENCY.UAH, currency, bagItem.price, exchangeState), currency)}
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
                        doExchange(
                            CURRENCY.UAH,
                            currency,
                            sum(Object.values(bagItems).map(item => item.price)),
                            exchangeState
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
