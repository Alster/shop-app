import {useLocale} from "next-intl";
import CatalogView from "@/app/[locale]/catalog/[[...categories]]/catalogView";
import {fetchProducts} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {fetchCategoryTree} from "@/utils/fetchCategoryTree";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";

interface Params_Categories {
    categories: string[]
}

export default async function CatalogPage({ params, searchParams }: { params: Params_Categories, searchParams: IFindProductsQuery }) {
    console.log('render static');
    const locale = useLocale();
    const currency = getCurrencyStatic();

    const selectedCategories = (params.categories && params.categories.length) ? params.categories : [];

    const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
        fetchProducts(locale, {...searchParams, categories: [selectedCategories.join("/")]}),
        fetchAttributes(locale),
        getStaticExchange(),
        fetchCategoryTree(locale),
    ]);

    return (
        <CatalogView
            productsResponseEncoded={JSON.stringify(productsResponse)}
            attributes={attributes}
            categories={categoryTree}
            selectedCategories={selectedCategories}
            exchangeState={exchangeState}
            currency={currency}
        ></CatalogView>
    )
}
