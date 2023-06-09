"use client"

import './productPage.css'
import {ChangeEvent, Fragment, MouseEventHandler, useState} from "react";
import {useTranslations} from 'next-intl';
import Link from "next-intl/link";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import Image from "next/image";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";
import {useRouter} from "next/navigation";
import {usePathname} from "next-intl/client";
import * as qs from "qs";
import {ATTRIBUTES, SIZE_ATTRS} from "@/app/constants";
import {IBagItem} from "@/utils/bag/IBagItem";
import Modal from "@/components/modal";
import {ShoppingBagIcon, CheckIcon} from "@heroicons/react/24/outline";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {formatPrice} from "@/shop-exchange-shared/formatPrice";
import {doExchange} from "@/shop-exchange-shared/doExchange";
import {moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";
import StatusInfo from "@/components/statusInfo";
import * as React from "react";
import {bagStore} from "@/utils/bag/bagItemsStorage";
import {createLikeItemKey, likeStore, useLikesStore} from "@/utils/likes/likeItemsStorage";
import {HeartIcon} from "@heroicons/react/24/solid";
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";

const UNSELECTED_ATTR_STYLE = "outline outline-2 outline-red-500";

export default function ProductPage({maybeProduct, attributes, categories, pageQuery, exchangeState, currency }: {
    maybeProduct: ProductDto | null,
    attributes: AttributeDto[],
    categories: CategoryDto[],
    pageQuery: {
        [ATTRIBUTES.COLOR]: string,
    },
    exchangeState: ExchangeState,
    currency: CURRENCY,
}) {
    const t = useTranslations('ProductsPage');
    const likeItems = useLikesStore();

    const [buyButtonClicked, setBuyButtonClicked] = useState(false);
    const [color, setColor] = useState(pageQuery[ATTRIBUTES.COLOR]);
    const [selectedSizeValue, setSelectedSizeValue] = useState<string | null>(null);

    const router = useRouter()
    const pathName = usePathname();

    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

    if (!maybeProduct || maybeProduct.quantity === 0) {
        return <StatusInfo
            iconConfig={{
                icon: <ShoppingBagIcon></ShoppingBagIcon>,
                textColor: "text-white-400",
                backgroundColor: "bg-gray-400"
            }}
            title={t("productNotAvailable")}
            description={t("productNotAvailableDescription")}
        ></StatusInfo>
    }
    const product = maybeProduct;

    const onColorChange = (e: ChangeEvent<HTMLInputElement>) => {};

    const onColorClick = (e: MouseEventHandler<HTMLInputElement>) => {
        // @ts-ignore
        const newColor = color === e.target.value ? null : e.target.value;
        setColor(newColor);
        const newQuery: any = {
            ...pageQuery,
        };
        if (newColor) {
            newQuery[ATTRIBUTES.COLOR] = newColor;
        } else {
            delete newQuery[ATTRIBUTES.COLOR];
        }
        router.replace(`${pathName}?${qs.stringify(newQuery)}`);
        refreshSelectableSizeValues();
    };

    const onSizeChange = (key: string, value: string) => {};

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

    function AttributeColor({ className }: { className?: string }) {
        const attribute = attributes.find(attr => attr.key === ATTRIBUTES.COLOR);
        if (!attribute) {
            return null;
        }

        const key = attribute.key;
        const values = product.attrs[key] || [];

        const highlightMustSelect = !color && buyButtonClicked;

        return <div key={key} className={className}>
            {drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectColor"))}
            <div className={`space-x-4 flex text-sm mt-2 p-2 ${highlightMustSelect && UNSELECTED_ATTR_STYLE}`}>
                {values.map(value => {
                    const style = getStyleByColorCode(value);
                    return <label key={value}>
                        <input
                            className="sr-only peer"
                            name={key} type="radio"
                            value={value}
                            checked={value === color}
                            onChange={onColorChange}
                            // @ts-ignore
                            onClick={onColorClick}
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
                            style={style}
                        >
                        </div>
                    </label>
                })}
            </div>
        </div>
    };

    function AttributeSize ({ className }: { className?: string }) {
        const attrPair = Object
            .entries(product.attrs)
            .find(([key, values]) => SIZE_ATTRS.includes(key as ATTRIBUTES));
        if (!attrPair) {
            return null;
        }

        const attributeKey = attrPair[0];
        const attribute = attributes.find(attr => attr.key === attributeKey);
        if (!attribute) {
            return null;
        }

        const values = product.attrs[attributeKey] || [];
        const highlightMustSelect = !selectedSizeValue && buyButtonClicked;

        return <div key={attributeKey} className={className}>
            {drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectSize"))}
            <div className={`space-x-4 flex text-sm mt-2 p-2 ${highlightMustSelect && UNSELECTED_ATTR_STYLE}`}>
                {values.map(value => {
                    return <label key={value}>
                        <input
                            className="sr-only peer"
                            name={attributeKey}
                            type="radio"
                            value={value}
                            onChange={(e) => onSizeChange(attributeKey, e.target.value)}
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

    function Characteristics({ className }: { className?: string }) {
        const characteristics = attributes.filter(attr => ![ATTRIBUTES.COLOR, ...SIZE_ATTRS].includes(attr.key as ATTRIBUTES));
        if (!characteristics.length) {
            return null;
        }

        return (
            <div className={className}>
                {characteristics.map(attr => (
                    <div key={attr.key} className="mt-2 mb-2 flex">
                        {drawAttributeTitle(attr?.title + ":", false, "")}
                        <div className="pl-3">
                            {(product.attrs[attr.key] || []).map(value => {
                                return <div key={value}>
                                    {attr?.values.find(val => val.key === value)?.title}
                                </div>
                            })}
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    const addToBag = () => {
        const attribute = attributes.find(attr => SIZE_ATTRS.includes(attr.key as ATTRIBUTES));
        if (!attribute) {
            throw new Error("No size attribute found");
        }

        if (!product.id) {
            throw new Error("No product id");
        }

        if (!selectedSizeValue) {
            throw new Error("No size selected");
        }

        const bagItem: IBagItem = {
            productId: product.id,
            publicId: product.publicId,
            title: product.title,
            price: product.price,
            image: "https://picsum.photos/200/200",
            attributes: {
                [ATTRIBUTES.COLOR.toString()]: [color],
                [attribute.key]: [selectedSizeValue],
            },
            quantity: 1,
        };

        bagStore.addToStore(bagItem);
    };

    const buyNow = () => {
        addToBag();
    };

    return <div className="flex items-center justify-center">
        {isAddProductModalOpen && (
            <Modal>
                <div className="flex items-center justify-between relative">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                        {t("productAddedToBag")}
                    </h3>
                    <button type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => setIsAddProductModalOpen(false)}>
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="flex justify-center m-8">
                    <div className="rounded-full bg-gray-100">
                        <CheckIcon className="m-4 h-16 w-16 text-green-400" />
                    </div>
                </div>
                <Link
                    href="/bag"
                    className="
                                     flex items-center justify-center h-12 border border-slate-200\
                                     uppercase font-medium tracking-wider
                                     dark:bg-slate-200 dark:text-black
                                     bg-slate-800 text-white
                                 ">
                    {t("goToBag")}
                </Link>
                <button
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="flex items-center justify-center w-full
                                    h-12 uppercase font-medium tracking-wider border
                                    dark:border-slate-200 dark:text-white
                                    border-slate-800 text-black
                                "
                    type="button">
                    {t("continueShopping")}
                </button>
            </Modal>
        )}

        <div className="products-page grid grid-cols-1 lg:grid-cols-2">
            <Link href={`/product/${product.id}`}>
                <Image
                    src="https://picsum.photos/200/200"
                    alt={product.title}
                    width={1000}
                    height={1000}
                    priority
                />
            </Link>
            <div className="p-3">
                <div className="flex"></div>
                <h1 className="flex-auto text-lg font-medium text-slate-700 dark:text-slate-200 mt-1">
                    {product.title}
                </h1>
                <div className="mt-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                    {formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, product.price, exchangeState)), currency)}
                </div>

                <div className="mt-4">
                    <AttributeColor className="mt-4"></AttributeColor>
                    <AttributeSize className="mt-4"></AttributeSize>
                    <Characteristics className="mt-4"></Characteristics>
                </div>

                <div className="flex space-x-4 mb-5 text-sm font-medium mt-6">
                    <button
                        onClick={() => {
                            setBuyButtonClicked(true);
                            if (!color || !selectedSizeValue) {
                                return;
                            }
                            buyNow();
                            setIsAddProductModalOpen(true);
                        }}
                        className="
                                flex flex-auto justify-center w-1/2 h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             ">
                        <span className="mt-2">
                            <ShoppingBagIcon className="h-8 w-8" />
                        </span>
                        <span className="mt-4 ml-2">
                            {t("bAdd")}
                            <span className="ml-2">{formatPrice(moneySmallToBig(doExchange(CURRENCY.UAH, currency, product.price, exchangeState)), currency)}</span>
                        </span>
                    </button>
                    <button
                        onClick={() => {
                            likeStore.addToStore({
                                productId: product.id,
                                publicId: product.publicId,
                                title: product.title,
                                price: product.price,
                                image: "https://picsum.photos/200/200",
                                attributes: {
                                    ...color ? {
                                        [ATTRIBUTES.COLOR.toString()]: [color],
                                    } : {}
                                },
                                quantity: 1,
                            })
                        }}
                        className="
                            flex-none flex items-center justify-center w-12 h-12 text-slate-300 border border-slate-200\
                        "
                        type="button"
                        aria-label="Like"
                    >
                        <HeartIcon className={`w-8 h-8 ${
                            likeItems.hasOwnProperty(createLikeItemKey({
                                productId: product.id,
                                attributes: {
                                    ...color ? {
                                        [ATTRIBUTES.COLOR.toString()]: [color],
                                    } : {}
                                },
                            })) ? "text-red-500" : "text-gray-400"
                        }`}></HeartIcon>
                    </button>
                </div>
            </div>
        </div >
    </div>
}
