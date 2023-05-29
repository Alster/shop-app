"use client"

import {useEffect, useState} from "react";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import Link from "next-intl/link";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import Image from "next/image";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";

import './productPage.css'

export default function ProductPage({product, attributes, categories}: {
    product: ProductDto,
    attributes: AttributeDto[],
    categories: CategoryDto[],
}) {
    const t = useTranslations('ProductsPage');
    const format = useFormatter();
    const locale = useLocale();


    return <div className="flex items-center justify-center">
        <div className="products-page grid grid-cols-1 lg:grid-cols-2">
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

                <div className="flex space-x-4 mb-5 text-sm font-medium mt-4">
                    <div className="flex-auto flex space-x-4 pr-4">
                        <button
                            className="
                                flex-none w-1/2 h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             "
                            type="submit">
                            Buy now
                        </button>
                        <button
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
                        className="flex-none flex items-center justify-center w-12 h-12 text-slate-300 border border-slate-200"
                        type="button" aria-label="Like">
                        <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
}
