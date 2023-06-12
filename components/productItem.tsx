import {IProductShortDto} from "@/utils/IProductShort.dto";
import Link from "next-intl/link";
import Image from "next/image";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import * as React from "react";
import {IBagItem} from "@/utils/bag/IBagItem";
import {useTranslations} from "next-intl";
import {ReactElement} from "react";
import {ExchangeState} from "@/shop-exchange-shared/helpers";

export default function ProductItem({ item, cornerBlock, currency, exchangeState }: {
    item: IProductShortDto,
    cornerBlock?: ReactElement,
    currency: CURRENCY,
    exchangeState: ExchangeState,
}) {
    const t = useTranslations('ProductItem');
    let productHref = `/product/${item.productId}`;

    if (item.attributes[ATTRIBUTES.COLOR]) {
        productHref += `?color=${item.attributes[ATTRIBUTES.COLOR][0]}`;
    }

    const drawSize = (bagItem: IBagItem) => {
        const sizeAttr = Object.entries(bagItem.attributes)
            .find(([key]) => Array.from(SIZE_ATTRS.values()).includes(key as ATTRIBUTES));

        if (!sizeAttr) {
            return null;
        }

        return sizeAttr[1].map(v => v.toUpperCase()).join(", ");
    };

    return <div className="p-1 m-3 flex">
        <Link
            href={productHref}
        >
            <Image
                className="rounded-2xl"
                src="https://picsum.photos/200/200"
                alt={item.title}
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
                    >{item.title}</Link>
                </div>
                <div>
                    {cornerBlock && cornerBlock}
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="flex-auto">
                    {item.attributes[ATTRIBUTES.COLOR] && (
                        <div className="text-md flex text-slate-500">
                            <div className="w-20 text-sm">{t("color")}:</div>
                            <div
                                style={{backgroundColor: item.attributes[ATTRIBUTES.COLOR][0]}}
                                className="ml-2 w-6 h-6 border-2 border-gray-300 dark:border-gray-700"
                            ></div>
                        </div>
                    )}
                    {item.attributes[ATTRIBUTES.SIZE] && (
                        <div className="flex">
                            <span className="w-20 text-slate-500 text-sm">{t("size")}</span>
                            <span className="font-bold pl-2">{drawSize(item)}</span>
                        </div>
                    )}
                </div>
                <div className="font-bold text-lg flex flex-wrap flex-col">
                    <div className="flex-auto"></div>
                    <div className="flex">
                        {formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, item.price, exchangeState)), currency)}
                    </div>
                </div>
            </div>
        </div>
    </div>
}
