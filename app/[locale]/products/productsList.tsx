"use client"

import * as React from "react";
import {useCallback, useEffect, useState} from "react";
import {useLocale, useTranslations} from 'next-intl';
import Link from "next-intl/link";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import Image from "next/image";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import StatusInfo from "@/components/statusInfo";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {ProductListResponseDto} from "@/shop-shared/dto/product/product-list.response.dto";
import {fetchProducts} from "@/utils/fetchProducts";
import {useRouter, useSearchParams} from "next/navigation";
import {usePathname} from "next-intl/client";
import * as qs from "qs";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import AttributeFilter from "@/components/attributeFilter";

export default function ProductsList({ productsResponseEncoded, attributes, categories, exchangeState, currency, pageQueryEncoded }: {
    productsResponseEncoded: string,
    attributes: AttributeDto[],
    categories: CategoryDto[],
    exchangeState: ExchangeState,
    currency: CURRENCY,
    pageQueryEncoded: string,
}) {
    const t = useTranslations('ProductsList');
    const locale = useLocale();

    const router = useRouter()
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const [productsResponse, setProductsResponse] = useState<ProductListResponseDto>(JSON.parse(productsResponseEncoded));
    const [pageQuery, setPageQuery] = useState<IFindProductsQuery>(JSON.parse(pageQueryEncoded));

    console.log("searchParams", qs.parse(searchParams.toString()))

    const pushQuery = (pageQuery: any) => {
        console.log("updateQuery", pageQuery)
        const newPath = `${pathName}?${qs.stringify(pageQuery)}`;
        console.log("newPath", newPath)
        router.push(newPath);
    }

    const updateProducts = async (pq: IFindProductsQuery) => {
        console.log("updateProducts", pq)
        const res = await fetchProducts(locale, pq);
        setProductsResponse(res);
    }

    useEffect(() => {
        console.log("searchParams triggered", searchParams)
        const params = qs.parse(searchParams.toString()) as any
        setPageQuery(params)
        updateProducts(params);
    }, [searchParams])

    const getAttrsFromQuery = (pq: IFindProductsQuery) => {
        const attrs: Record<string, string[]> = {};
        (pq.attrs || []).forEach((attr) => {
            attrs[attr.key] = [...attr.values];
        });
        return attrs;
    }

    const storeAttrsToQuery = (attrs: Record<string, string[]>) => {
        return {
            ...(qs.parse(searchParams.toString()) as any),
            attrs: Object.entries(attrs).map(([key, values]) => ({key, values}))
        };
    }

    const addFilterValue = (key: string, value: string) => {
        const attrs = getAttrsFromQuery(qs.parse(searchParams.toString()) as any);

        if (attrs[key]) {
            attrs[key] = Array.from((new Set([...attrs[key], value])));
        } else {
            attrs[key] = [value];
        }

        const newQuery = storeAttrsToQuery(attrs);
        pushQuery(newQuery);
    }

    const removeFilterValue = (key: string, value: string) => {
        const attrs = getAttrsFromQuery(qs.parse(searchParams.toString()) as any);

        if (attrs[key]) {
            attrs[key] = attrs[key].filter((v: string) => v !== value);
            if (attrs[key].length === 0) {
                delete attrs[key];
            }
        }

        const newQuery = storeAttrsToQuery(attrs);
        pushQuery(newQuery);
    }

    const toggleFilterValue = (key: string, value: string) => {
        const attrs = getAttrsFromQuery(qs.parse(searchParams.toString()) as any);

        if (attrs[key]) {
            if (attrs[key].includes(value)) {
                attrs[key] = attrs[key].filter((v: string) => v !== value);
                if (attrs[key].length === 0) {
                    delete attrs[key];
                }
            } else {
                attrs[key] = Array.from((new Set([...attrs[key], value])));
            }
        } else {
            attrs[key] = [value];
        }

        const newQuery = storeAttrsToQuery(attrs);
        pushQuery(newQuery);
    }

    if (!productsResponse.products.length) {
        return <StatusInfo
            iconConfig={{
                icon: <MagnifyingGlassIcon></MagnifyingGlassIcon>,
                textColor: "text-white-400",
                backgroundColor: "bg-gray-400"
            }}
            title={t("emptyProductsList")}
            description={t("emptyProductsListDescription")}
        ></StatusInfo>
    }

    const drawColorAttributes = (product: ProductDto) => {
        const attr = product.attrs[ATTRIBUTES.COLOR];
        if (!attr) {
            return null;
        }

        return <div className="flex gap-2">
            {attr.map(value => (
                <Link href={`/product/${product.id}?${ATTRIBUTES.COLOR}=${value}`} key={value}>
                    <div className="
                        w-6 h-6 border-2
                        border-gray-300 hover:border-gray-600
                        dark:border-gray-700 hover:dark:border-gray-400
                    " style={{backgroundColor: value}}></div>
                </Link>
            ))}
        </div>
    }

    const drawSizeAttributes = (product: ProductDto) => {
        const foundAttrs = Object.entries(product.attrs).filter(([key, value]) => SIZE_ATTRS.includes(key as ATTRIBUTES));
        if (!foundAttrs.length) {
            return null;
        }
        const attr = foundAttrs[0];

        const attribute = attributes.find(a => a.key === attr[0]);
        if (!attribute) {
            return null;
        }

        return <div className="flex gap-2 ml-auto">
            {attr[1].map(value => (
                <div key={value}>{attribute.values.find(val => val.key === value)?.title}</div>
            ))}
        </div>
    }

    const drawFilters = () => {
        return (
            <div className="flex">
                {Object.entries(productsResponse.filters).map(([key, values]) => (
                    <AttributeFilter
                        key={key}
                        values={values}
                        selected={pageQuery.attrs?.find((attr: any) => attr.key === key)?.values || []}
                        attributeInfo={attributes.find(a => a.key === key)}
                        onToggle={(value: string) => toggleFilterValue(key, value)}
                    ></AttributeFilter>
                )
                )}
            </div>
        )
    }

    return <div>
        {/*{searchParams.toString()}*/}
        {drawFilters()}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {productsResponse.products.map(product => (
                <div key={product.id} className="border-2 border-gray-300 dark:border-gray-700 m-1">
                    <Link href={`/product/${product.id}`}>
                        <Image
                            src="https://picsum.photos/200/200"
                            alt={product.title}
                            width={400}
                            height={400}
                            loading="lazy"
                        />
                    </Link>
                    <div className="p-3">
                        <div className="flex">
                            {drawColorAttributes(product)}
                            {drawSizeAttributes(product)}
                        </div>
                        <div className="flex flex-wrap">
                            <h1 className="flex-auto text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
                                {product.title}
                            </h1>
                            <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                {formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, product.price, exchangeState)), currency)}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
}
