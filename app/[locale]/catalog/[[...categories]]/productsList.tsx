'use client'

import Link from "next-intl/link";
import Image from "next/image";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import * as React from "react";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {ExchangeState} from "@/shop-exchange-shared/helpers";

export default function ProductsList({ products, attributes, currency, exchangeState }: {
    products: ProductDto[], attributes: AttributeDto[], currency: CURRENCY, exchangeState: ExchangeState
}) {

    function AttributesLine({ product, className }: { product: ProductDto, className: string }) {
        const colorValues = product.attrs[ATTRIBUTES.COLOR] || [];

        let sizeKey = '';
        let sizeValues: string[] = [];
        const foundSizeAttrs = Object.entries(product.attrs).filter(([key, value]) => SIZE_ATTRS.includes(key as ATTRIBUTES));
        if (foundSizeAttrs.length) {
            const sizeAttribute = foundSizeAttrs[0];
            sizeKey = sizeAttribute[0];
            sizeValues = sizeAttribute[1];
        }

        const total = colorValues.length + sizeValues.length;
        const arr1Size = Math.floor((colorValues.length / total) * 100);
        const arr2Size = Math.floor((sizeValues.length / total) * 100);
        const style1 = { flexBasis: arr1Size + "%" };
        const style2 = { flexBasis: arr2Size + "%" };

        return (
            <div className={`flex ${className}`}>
                <ColorAttribute
                    className={`flex flex-wrap gap-1`}
                    style={style1}
                    values={colorValues}
                    product={product}
                ></ColorAttribute>
                <SizeAttribute
                    className={`flex flex-wrap gap-1 justify-end`}
                    style={style2}
                    values={sizeValues}
                    attrKey={sizeKey}
                ></SizeAttribute>
            </div>
        )
    }

    function ColorAttribute({ values, product, className, style }: { values: string[], product: ProductDto, className: string, style: any }) {
        return <div className={`${className} content-start`} style={style}>
            {values.map(value => {
                const style = getStyleByColorCode(value);
                return (
                    <Link
                        href={`/product/${product.publicId}?${ATTRIBUTES.COLOR}=${value}`}
                        key={value}
                        className="
                        flex-grow-0
                        w-6 h-6 border-2
                        border-gray-300 hover:border-gray-600
                        dark:border-gray-700 hover:dark:border-gray-400
                    "
                        style={style}
                    >
                    </Link>
                )
            })}
        </div>
    }

    function SizeAttribute({ values, attrKey, className, style }: { values: string[], attrKey: string, className: string, style: any }) {
        const attribute = attributes.find(a => a.key === attrKey);
        if (!attribute) {
            console.log("SizeAttribute: attribute not found", attrKey)
            return <div className={className}></div>;
        }

        return <div className={`${className} content-start`} style={style}>
            {values.map(value => (
                <span key={value} className="flex-grow-0 h-6">{attribute.values.find(val => val.key === value)?.title}</span>
            ))}
        </div>
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
            {products.map(product => (
                <div key={product.id} className="m-1 flex flex-wrap flex-col">
                    <Link href={`/product/${product.publicId}`}>
                        <Image
                            src="https://picsum.photos/200/200"
                            alt={product.title}
                            width={400}
                            height={400}
                            loading="lazy"
                        />
                    </Link>
                    <div className="flex flex-wrap">
                        <h1 className="flex-auto text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
                            {product.title}
                        </h1>
                        <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, product.price, exchangeState)), currency)}
                        </div>
                    </div>
                    <AttributesLine className="mt-1" product={product}></AttributesLine>
                </div>
            ))}
        </div>
    )
}
