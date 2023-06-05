"use client"

import {bagSlice, useAppDispatch, useAppSelector} from "@/utils/store/store";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import Image from "next/image";
import {IBagItem} from "@/utils/bag/IBagItem";
import {MinusSmallIcon, PlusSmallIcon, ShoppingBagIcon, TrashIcon} from "@heroicons/react/24/outline";
import {ReactElement} from "react";
import {useFormatter, useTranslations} from "next-intl";

export default function BagView() {
    const t = useTranslations('BagPage');
    const format = useFormatter();
    const dispatch = useAppDispatch();
    const reducers = useAppSelector(state => state);
    const bagItems = reducers.bag;

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
                        <div className="text-md flex text-slate-500">
                            <div>{t("color")}:</div>
                            <div
                                style={{backgroundColor: bagItem.attributes[ATTRIBUTES.COLOR][0]}}
                                className="ml-2 w-6 h-6 border-2 border-gray-300 dark:border-gray-700"
                            ></div>
                        </div>
                        <div>
                            <span className="text-slate-500">{t("size")}</span>:
                            <span className="font-bold pl-2">{drawSize(bagItem)}</span>
                        </div>
                    </div>
                    <div>
                        <button
                            className=""
                            onClick={() => {
                                dispatch(bagSlice.actions.remove(key))
                            }}
                        ><TrashIcon className="h-6 w-6 text-gray-500" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap">
                    <div className="flex-auto flex">
                        <button
                            className="bg-slate-200 rounded-full"
                        >
                            <MinusSmallIcon className="h-6 w-6 text-black" />
                        </button>
                        <div className="pl-4 pr-4 font-bold text-lg">{bagItem.quantity}</div>
                        <button
                            className="bg-slate-200 rounded-full"
                        >
                            <PlusSmallIcon className="h-6 w-6 text-black" />
                        </button>
                    </div>
                    <div className="font-bold text-lg">{format.number(bagItem.price, {style: 'currency', currency: 'USD'})}</div>
                </div>
            </div>
        </div>;
    }

    return <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="pl-8 pr-8">
            {Object
                .entries(bagItems)
                .map(([key, bagItem]) => drawItem(key, bagItem))
                .reduce((prev, elem) => {
                    if (prev.length > 0) {
                        prev.push(<hr className="border-gray-300 dark:border-gray-700" />);
                    }
                    prev.push(elem);
                    return prev;
                }, [] as ReactElement[])
            }
        </div>
        <div className="m-2 p-2 bg-gray-100 dark:bg-gray-900">
            <div className="text-lg flex">
                <div className="flex-auto">{t("totalPrice")}:</div>
                <div className="font-bold">{
                    format.number(
                        sum(Object.values(bagItems).map(item => item.price)),
                        {style: 'currency', currency: 'USD'})
                }</div>
            </div>
            <hr className="border-gray-300 dark:border-gray-700 m-4" />
            <button
                onClick={() => {}}
                className="
                                flex justify-center w-full h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             ">
                <span className="mt-3 ml-2">
                    {`${t("bCheckout")}`}
                </span>
            </button>
        </div>
    </div>
}
