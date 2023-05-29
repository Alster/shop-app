"use client"

import {useEffect, useState} from "react";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import Link from "next-intl/link";
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import Image from "next/image";
import {ProductDto} from "@/shop-shared/dto/product/product.dto";

export default function ProductsList({defaultList, attributes, categories}: {
    defaultList: ProductsListType,
    attributes: AttributeDto[],
    categories: CategoryDto[],
}) {
    const t = useTranslations('ProductsList');
    const format = useFormatter();
    const locale = useLocale();

    const [products, setProducts] = useState<ProductsListType>(defaultList);

    const updateProducts = async () => {
        const data = await fetchProducts(locale);
        console.log(data)
        // setProducts(data ? data.products : []);
        setProducts(data);
    };

    useEffect(() => {
        void updateProducts();
    }, []);

    const drawColorAttributes = (product: ProductDto) => {
        const attr = product.attrs['color'];
        if (!attr) {
            return null;
        }

        return <div className="flex gap-2">
            {attr.map(value => (
                <Link href={`/product/${product.id}?color=${value}`} key={value}>
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
        const attr = product.attrs['size'];
        if (!attr) {
            return null;
        }
        const attribute = attributes.find(a => a.key === 'size');
        if (!attribute) {
            return null;
        }

        return <div className="flex gap-2 ml-auto">
            {attr.map(value => (
                <div key={value}>{attribute.values.find(val => val.key === value)?.title}</div>
            ))}
        </div>
    }

    return <div className="flex gap-2">
        Products list {t('hello')}
        {products.length}
        {products.map(product => (
            <div key={product.id} className="border-2 border-gray-300 dark:border-gray-700">
                <Link href={`/product/${product.id}`}>
                    <Image
                        src="https://picsum.photos/200/200"
                        alt={product.title}
                        width={300}
                        height={300}
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
                            ${product.price}
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
}
