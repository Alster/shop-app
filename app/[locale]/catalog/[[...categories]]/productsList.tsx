"use client"

import * as React from "react";
import {Fragment, RefObject, useEffect, useReducer, useRef, useState} from "react";
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
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";
import TextSearchMobile from "@/components/textSearchMobile";
import {AdjustmentsHorizontalIcon} from "@heroicons/react/24/solid";
import TextSearchDesktop from "@/components/textSearchDesktop";
import useSearchTerm from "@/utils/seearch/useSearchTerm";

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

    const [searchTerm, setSearchTerm] = useSearchTerm(pageQuery.search || "");
    useEffect(() => {
        if (searchTerm !== pageQuery.search) {
            const newPageQuery = { ...pageQuery };
            if (searchTerm === "") {
                delete newPageQuery.search;
                pushQuery({ ...newPageQuery });
            } else {
                pushQuery({ ...newPageQuery, search: searchTerm });
            }
        }
    }, [searchTerm]);

    const [showMobileFilters, toggleShowMobileFilters] = useReducer((state: boolean) => !state, false);

    console.log("ProductsList searchParams", qs.parse(searchParams.toString()))

    const pushQuery = (pageQuery: any) => {
        console.log("updateQuery", pageQuery)
        const newPath = `${pathName}?${qs.stringify(pageQuery)}`;
        console.log("newPath", newPath)
        router.push(newPath);
    }

    const updateProducts = async (pq: IFindProductsQuery) => {
        if (selectedCategories.length > 0) {
            pq.categories = [selectedCategories.join('/')];
        }
        console.log("updateProducts", pq)
        const res = await fetchProducts(locale, pq);
        delete pq.categories;
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

    function FiltersDesktop({ className }: { className?: string }) {
        return (
            <div className={`${className} flex flex-wrap items-center`}>
                <TextSearchDesktop className="hidden lg:flex"></TextSearchDesktop>
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

    function FiltersButtonMobile({ className, toggle }: { className?: string, toggle: () => void }) {

        return (
            <Fragment>
                <div className={`${className} flex flex-wrap`}>
                    <button
                        onClick={() => toggle()}
                        className="
                                flex justify-center items-center w-full h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             ">
                        <div className="flex items-center">
                            <AdjustmentsHorizontalIcon className="h-10 w-10 inline-block"></AdjustmentsHorizontalIcon>
                            <div>Filters</div>
                        </div>
                    </button>
                </div>
            </Fragment>
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

    return (
        <Fragment>
            {showMobileFilters && (
                <div className="fixed w-full h-full top-0">
                    <div className="flex flex-col h-full w-full bg-white dark:bg-slate-800">
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
                </div>
            )}
            {!showMobileFilters && (
                <Fragment>
                    <TextSearchMobile className="flex lg:hidden"></TextSearchMobile>
                    <FiltersButtonMobile toggle={toggleShowMobileFilters} className="flex lg:hidden"></FiltersButtonMobile>
                    <div className="flex">
                        {/*{searchParams.toString()}*/}
                        {drawCategories()}
                        <div>
                            <FiltersDesktop className="hidden lg:flex"></FiltersDesktop>
                            {!productsResponse.products.length && (
                                <StatusInfo
                                    iconConfig={{
                                        icon: <MagnifyingGlassIcon></MagnifyingGlassIcon>,
                                        textColor: "text-white-400",
                                        backgroundColor: "bg-gray-400"
                                    }}
                                    title={t("emptyProductsList")}
                                    description={t("emptyProductsListDescription")}
                                ></StatusInfo>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                                {productsResponse.products.map(product => (
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
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}
