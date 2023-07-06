'use client'

import * as React from "react";
import {useSearchParams} from "next/navigation";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {ProductListResponseDto} from "@/shop-shared/dto/product/product-list.response.dto";
import {usePathname} from "next-intl/client";
import CategoryTreeView from "@/components/categoryTreeView";
import Image from "next/image";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";
import Link from "next-intl/link";
import StatusInfo from "@/components/statusInfo";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useTranslations} from "next-intl";
import TextSearchDesktop from "@/components/textSearchDesktop";
import AttributeFilter from "@/components/attributeFilter";

export default function CatalogView({ productsResponseEncoded, attributes, categories, selectedCategories, exchangeState, currency }: {
    productsResponseEncoded: string,
    attributes: AttributeDto[],
    categories: CategoriesNodeDto[],
    selectedCategories: string[],
    exchangeState: ExchangeState,
    currency: CURRENCY,
}) {
    console.log(`render view`);
    const t = useTranslations('ProductsList');
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const productsResponse: ProductListResponseDto = JSON.parse(productsResponseEncoded);

    function Categories() {
        return (
            <div className="flex">
                <CategoryTreeView
                    tree={categories}
                    selectedCategories={selectedCategories}
                ></CategoryTreeView>
            </div>
        )
    }

    function ProductsList() {
        return (
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
        )
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
                    // eslint-disable-next-line react/jsx-no-undef
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
                            attributeInfo={attributes.find(a => a.key === key)}
                        ></AttributeFilter>
                    )
                )}
            </div>
        )
    }

    return (
        <div className="flex">
            <Categories></Categories>
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
                <ProductsList></ProductsList>
            </div>
        </div>
    )
}
