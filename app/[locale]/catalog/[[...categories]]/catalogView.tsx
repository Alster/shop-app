'use client'

import * as React from "react";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {ProductListResponseDto} from "@/shop-shared/dto/product/product-list.response.dto";
import CategoryTreeView from "@/components/categoryTreeView";
import StatusInfo from "@/components/statusInfo";
import {MagnifyingGlassIcon} from "@heroicons/react/24/outline";
import {useTranslations} from "next-intl";
import TextSearchDesktop from "@/components/textSearchDesktop";
import AttributeFilter from "@/components/attributeFilter";
import ProductsList from "@/app/[locale]/catalog/[[...categories]]/productsList";

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
                <ProductsList
                    products={productsResponse.products}
                    attributes={attributes}
                    currency={currency}
                    exchangeState={exchangeState}
                ></ProductsList>
            </div>
        </div>
    )
}
