"use client"

import * as React from "react";
import {RefObject, useEffect, useRef, useState} from "react";
import {useLocale, useTranslations} from 'next-intl';
import Link from "next-intl/link";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
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
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";
import CategoryTreeView from "@/components/categoryTreeView";

export default function ProductsList({ productsResponseEncoded, attributes, categories, selectedCategories, exchangeState, currency, pageQueryEncoded }: {
    productsResponseEncoded: string,
    attributes: AttributeDto[],
    categories: CategoriesNodeDto[],
    selectedCategories: string[],
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
        if (selectedCategories.length > 0) {
            pq.categories = selectedCategories;
        }
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

    function AttributesLine({ product }: { product: ProductDto }) {
        const colorValues = product.attrs[ATTRIBUTES.COLOR] || [];

        let sizeKey = '';
        let sizeValues: string[] = [];
        const foundSizeAttrs = Object.entries(product.attrs).filter(([key, value]) => SIZE_ATTRS.includes(key as ATTRIBUTES));
        if (foundSizeAttrs.length) {
            const sizeAttribute = foundSizeAttrs[0];
            sizeKey = sizeAttribute[0];
            sizeValues = sizeAttribute[1];
        }

        const arr1DivRef = useRef<HTMLDivElement>(null);
        const arr2DivRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (!arr1DivRef.current || !arr2DivRef.current) {
                return;
            }
            const arr1DivWidth = arr1DivRef.current.offsetWidth;
            const arr2DivWidth = arr2DivRef.current.offsetWidth;
            const totalWidth = arr1DivWidth + arr2DivWidth;

            const arr1Width = Math.floor(arr1DivWidth / totalWidth * 100);
            const arr2Width = Math.floor(arr2DivWidth / totalWidth * 100);
            arr1DivRef.current.style.flexBasis = arr1Width + "%";
            arr2DivRef.current.style.flexBasis = arr2Width + "%";
        }, []);

        return (
            <div className="flex flex-wrap">
                <ColorAttribute
                    reference={arr1DivRef}
                    className={`flex flex-wrap gap-1`}
                    product={product}
                    values={colorValues}
                ></ColorAttribute>
                <SizeAttribute
                    reference={arr2DivRef}
                    className={`flex flex-wrap gap-1 justify-end`}
                    values={sizeValues}
                    attrKey={sizeKey}
                ></SizeAttribute>
            </div>
        )
    }

    function ColorAttribute({ values, product, className, reference }: { values: string[], product: ProductDto, className: string, reference: RefObject<HTMLDivElement> }) {
        return <div className={className} ref={reference}>
            {values.map(value => (
                <Link href={`/product/${product.id}?${ATTRIBUTES.COLOR}=${value}`} key={value}>
                    <div className="
                        flex-grow-0
                        w-5 h-5 border-2
                        border-gray-300 hover:border-gray-600
                        dark:border-gray-700 hover:dark:border-gray-400
                    " style={{backgroundColor: value}}></div>
                </Link>
            ))}
        </div>
    }

    function SizeAttribute({ values, attrKey, className, reference }: { values: string[], attrKey: string, className: string, reference: RefObject<HTMLDivElement> }) {
        const attribute = attributes.find(a => a.key === attrKey);
        if (!attribute) {
            console.log("SizeAttribute: attribute not found", attrKey)
            return <div className={className}></div>;
        }

        return <div className={className} ref={reference}>
            {values.map(value => (
                <div key={value} className="flex-grow-0">{attribute.values.find(val => val.key === value)?.title}</div>
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

    const drawCategories = () => {
        return (
            <div className="flex">
                <CategoryTreeView
                    tree={categories}
                    selectedCategories={selectedCategories}
                ></CategoryTreeView>
            </div>
        )
    }

    return <div className="flex">
        {/*{searchParams.toString()}*/}
        {drawCategories()}
        <div>
            {drawFilters()}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                {productsResponse.products.map(product => (
                    <div key={product.id} className="m-1">
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
                            <AttributesLine product={product}></AttributesLine>
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
    </div>
}
