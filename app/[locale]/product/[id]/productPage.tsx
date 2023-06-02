"use client"

import './productPage.css'
import {ChangeEvent, useState} from "react";
import {useFormatter, useLocale, useTranslations} from 'next-intl';
import Link from "next-intl/link";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import Image from "next/image";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {useRouter} from "next/navigation";
import {usePathname} from "next-intl/client";
import * as qs from "qs";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";

const UNSELECTED_ATTR_STYLE = "outline outline-2 outline-red-500";

export default function ProductPage({product, attributes, categories, pageQuery }: {
    product: ProductDto,
    attributes: AttributeDto[],
    categories: CategoryDto[],
    pageQuery: {
        [ATTRIBUTES.COLOR]: string
    },
}) {
    const t = useTranslations('ProductsPage');
    const format = useFormatter();
    const locale = useLocale();

    const [buyButtonClicked, setBuyButtonClicked] = useState(false);
    const [color, setColor] = useState(pageQuery[ATTRIBUTES.COLOR]);
    const [selectedSizeValue, setSelectedSizeValue] = useState<string | null>(null);

    const router = useRouter()
    const pathName = usePathname();

    const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        router.replace(`${pathName}?${qs.stringify({ ...pageQuery, [ATTRIBUTES.COLOR]: newColor })}`);
        refreshSelectableSizeValues();
    };

    const onSizeChange = (key: string, value: string) => {

    };

    const sizeSelect = (value: string) => {
        setSelectedSizeValue(value);
    };
    const sizeReset = () => {
        setSelectedSizeValue(null);
    };

    const selectableSizeValues: Set<string> = new Set();
    const refreshSelectableSizeValues = () => {
        selectableSizeValues.clear();
        Object.entries(product.items).forEach(([sku, item]) => {
            if (item.attributes[ATTRIBUTES.COLOR]?.includes(color)) {
                const values = Array.from(SIZE_ATTRS.values())
                    .map(key => item.attributes[key])
                    .find(values => values) || [];
                values.forEach(value => selectableSizeValues.add(value));
            }
        });

        if (selectedSizeValue && !selectableSizeValues.has(selectedSizeValue)) {
            sizeReset();
        }
    };
    refreshSelectableSizeValues();

    const drawAttributeTitle = (title: string, highlightMustSelect: boolean, highlightText: string) => {
        return <div className="text-slate-600 dark:text-slate-300">
            {title}
            {highlightMustSelect && <span className="pl-3 text-red-500">{highlightText}</span>}
        </div>
    };

    const drawColorAttributes = () => {
        const attribute = attributes.find(attr => attr.key === ATTRIBUTES.COLOR);
        if (!attribute) {
            return null;
        }

        const key = attribute.key;
        const values = product.attrs[key] || [];

        const highlightMustSelect = !color && buyButtonClicked;

        return <div key={key} className="mt-4">
            {drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectColor"))}
            <div className={`space-x-4 flex text-sm mt-2 p-2 ${highlightMustSelect && UNSELECTED_ATTR_STYLE}`}>
                {values.map(value => {
                    return <label key={value}>
                        <input
                            className="sr-only peer"
                            name={key} type="radio"
                            value={value}
                            checked={value === color}
                            onChange={onColorChange}
                        />
                        <div
                            className="h-9 w-9 flex items-center justify-center
                                                border-2 peer-checked:border-4
                                                border-black
                                                dark:border-white
                                                peer-checked:outline peer-checked:outline-4
                                                outline-black
                                                dark:outline-white
                                                cursor-pointer
                                                "
                            style={{backgroundColor: value}}
                        >
                        </div>
                    </label>
                })}
            </div>
        </div>
    };

    const drawSizeAttributes = () => {
        const attribute = attributes.find(attr => SIZE_ATTRS.includes(attr.key as ATTRIBUTES));
        if (!attribute) {
            return null;
        }

        const key = attribute.key;
        const values = product.attrs[key] || [];

        const highlightMustSelect = !selectedSizeValue && buyButtonClicked;

        return <div key={key} className="mt-4">
            {drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectSize"))}
            <div className={`space-x-4 flex text-sm mt-2 p-2 ${highlightMustSelect && UNSELECTED_ATTR_STYLE}`}>
                {values.map(value => {
                    return <label key={value}>
                        <input
                            className="sr-only peer"
                            name={key}
                            type="radio"
                            value={value}
                            onChange={(e) => onSizeChange(key, e.target.value)}
                            disabled={!selectableSizeValues.has(value)}
                            checked={value === selectedSizeValue}
                        />
                        <div
                            onClick={() => sizeSelect(value)}
                            className="h-9 p-3 flex items-center justify-center peer-checked:font-semibold border
                                            text-slate-700 peer-checked:bg-slate-900 peer-checked:text-white
                                            dark:text-slate-200 dark:peer-checked:bg-slate-100 dark:peer-checked:text-black dark:border-white
                                            peer-disabled:opacity-30
                                            cursor-pointer
                                            ">
                            {attribute?.values.find(val => val.key === value)?.title}
                        </div>
                    </label>
                })}
            </div>
        </div>
    };

    const drawCharacteristics = () => {
        const attribute = attributes.find(attr => ![ATTRIBUTES.COLOR, ...SIZE_ATTRS].includes(attr.key as ATTRIBUTES));
        if (!attribute) {
            return null;
        }

        const key = attribute.key;
        const values = product.attrs[key] || [];

        return <div key={key} className="mt-8 mb-8 flex">
            {drawAttributeTitle(attribute?.title + ":", false, "")}
            <div className="pl-3">
                {values.map(value => {
                    return <div key={value}>
                        {attribute?.values.find(val => val.key === value)?.title}
                    </div>
                })}
            </div>
        </div>
    };

    return <div className="flex items-center justify-center">
        <form className="products-page grid grid-cols-1 lg:grid-cols-2">
            <Link href={`/product/${product.id}`}>
                <Image
                    src="https://picsum.photos/200/200"
                    alt={product.title}
                    width={1000}
                    height={1000}
                    loading="lazy"
                />
            </Link>
            <div className="p-3">
                <div className="flex"></div>
                <h1 className="flex-auto text-lg font-medium text-slate-700 dark:text-slate-200 mt-1">
                    {product.title}
                </h1>
                <div className="mt-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    ${product.price}
                </div>

                <div className="mt-4">
                    {drawColorAttributes()}
                    {drawSizeAttributes()}
                    {drawCharacteristics()}
                </div>

                <div className="flex space-x-4 mb-5 text-sm font-medium mt-6">
                    <div className="flex-auto flex space-x-4 pr-4">
                        <button
                            onClick={() => setBuyButtonClicked(true)}
                            className="
                                flex-none w-1/2 h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             "
                            type="submit">
                            Buy now
                        </button>
                        <button
                            onClick={() => setBuyButtonClicked(true)}
                            className="
                                flex-none w-1/2 h-12 uppercase font-medium tracking-wider border
                                dark:border-slate-200 dark:text-white
                                border-slate-800 text-black
                            "
                            type="button">
                            Add to bag
                        </button>
                    </div>
                    <button
                        className="
                            flex-none flex items-center justify-center w-12 h-12 text-slate-300 border border-slate-200\
                        "
                        type="button" aria-label="Like">
                        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </form >
    </div>
}
