import ProductsList from "@/app/[locale]/catalog/[[...categories]]/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import {fetchCategoryTree} from "@/utils/fetchCategoryTree";
import {CategoriesNodeDto} from "@/shop-shared/dto/category/categories-tree.dto";

export interface Params_Categories {
    categories: string[]
}

export default async function ProductsPage({ params, searchParams }: { params: Params_Categories, searchParams: IFindProductsQuery }) {
    const locale = useLocale();

    const selectedCategories = (params.categories && params.categories.length) ? params.categories : [];

    console.log("ProductsPage searchParams", JSON.stringify(searchParams, null, 2))

    const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
        fetchProducts(locale, {...searchParams, categories: [selectedCategories.join("/")]}),
        fetchAttributes(locale),
        getStaticExchange(),
        fetchCategoryTree(locale),
    ]);

    return <ProductsContent
        productsResponseEncoded={JSON.stringify(productsResponse)}
        attributes={attributes}
        categories={categoryTree}
        exchangeState={exchangeState}
        pageQueryEncoded={JSON.stringify(searchParams)}
        selectedCategories={selectedCategories}
    ></ProductsContent>
}

function ProductsContent (props: {
    productsResponseEncoded: string,
    attributes: AttributeDto[],
    categories: CategoriesNodeDto[],
    exchangeState: ExchangeState,
    pageQueryEncoded: string,
    selectedCategories: string[],
}) {
    const t = useTranslations('ProductsList');
    const currency = getCurrencyStatic();

    return <div>
        <ProductsList
            {...props}
            currency={currency}
        ></ProductsList>
    </div>
}
