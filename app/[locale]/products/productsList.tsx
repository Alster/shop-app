"use client"

import {useEffect, useState} from "react";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";

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

    return <div>
        Products list {t('hello')}
        {products.length}
        {products.map(product => (
            <div key={product.id} className="bg-amber-50">
                <div className="flex font-sans">
                    <div className="flex-none w-48 relative">
                        <img src="https://picsum.photos/200/300" alt=""
                             className="absolute inset-0 w-full h-full object-cover" loading="lazy"/>
                    </div>
                    <form className="flex-auto p-6">
                        <div className="flex flex-wrap">
                            <h1 className="flex-auto text-lg font-semibold text-slate-900">
                                {product.title}
                            </h1>
                            <div className="text-lg font-semibold text-slate-500">
                                ${product.price}
                            </div>
                            <div className="w-full flex-none text-sm font-medium text-slate-700 mt-2">
                                In stock
                            </div>
                        </div>
                        <div className="flex space-x-4 mb-6 text-sm font-medium">
                            <div className="flex-auto flex space-x-4">
                                <button className="h-10 px-6 font-semibold rounded-md bg-black text-white"
                                        type="submit">
                                    Buy now
                                </button>
                                <button
                                    className="h-10 px-6 font-semibold rounded-md border border-slate-200 text-slate-900"
                                    type="button">
                                    Add to bag
                                </button>
                            </div>
                            <button
                                className="flex-none flex items-center justify-center w-9 h-9 rounded-md text-slate-300 border border-slate-200"
                                type="button" aria-label="Like">
                                <svg width="20" height="20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm text-slate-700">
                            Free shipping on all continental US orders.
                        </p>
                    </form>
                </div>

                {/*<p>{product.title}</p>*/}
                {/*/!*<Image*!/*/}
                {/*/!*    src={product.image}*!/*/}
                {/*/!*    alt={product.title}*!/*/}
                {/*/!*    width={128}*!/*/}
                {/*/!*    height={128}*!/*/}
                {/*/!*></Image>*!/*/}
                {/*<div>${product.price}</div>*/}
                {/*<div>{product.description}</div>*/}
            </div>
        ))}
    </div>
}
