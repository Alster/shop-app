import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {ProductListResponseDto} from "@/shop-shared/dto/product/product-list.response.dto";
import {IFindProductsQuery} from "@/utils/products/parseQuery";

export default async function ProductsPage({ searchParams }: { searchParams: IFindProductsQuery }) {
    const locale = useLocale();

    console.log("searchParams", JSON.stringify(searchParams, null, 2))

    const [productsResponse, attributes, categories , exchangeState] = await Promise.all([
        fetchProducts(locale, searchParams),
        fetchAttributes(locale),
        fetchCategoryList(locale),
        getStaticExchange(),
        ]
    );

    return <ProductsContent
        productsResponseEncoded={JSON.stringify(productsResponse)}
        attributes={attributes}
        categories={categories}
        exchangeState={exchangeState}
        pageQueryEncoded={JSON.stringify(searchParams)}
    ></ProductsContent>
}

function ProductsContent ({ productsResponseEncoded, attributes, categories, exchangeState, pageQueryEncoded }: {
    productsResponseEncoded: string,
    attributes: AttributeDto[],
    categories: CategoryDto[],
    exchangeState: ExchangeState,
    pageQueryEncoded: string,
}) {
    const t = useTranslations('ProductsList');
    const currency = getCurrencyStatic();

    return <div>
        <ProductsList
            productsResponseEncoded={productsResponseEncoded}
            attributes={attributes}
            categories={categories}
            exchangeState={exchangeState}
            currency={currency}
            pageQueryEncoded={pageQueryEncoded}
        ></ProductsList>
    </div>
}
