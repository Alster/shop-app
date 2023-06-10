import {useLocale} from "next-intl";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {fetchProduct} from "@/utils/fetchProduct";
import ProductPage from "@/app/[locale]/product/[id]/productPage";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";

export interface Params_ProductId {
    id: string
}

export default async function Product({ params, searchParams }: { params: Params_ProductId, searchParams: any }) {
    const locale = useLocale();
    const currency = getCurrencyStatic();

    const [product, attributes, categories, exchangeState ] = await Promise.all([
        fetchProduct(params.id, locale),
        fetchAttributes(locale),
        fetchCategoryList(locale),
        getStaticExchange(),
    ]);

    return <ProductPage
        product={product}
        attributes={attributes}
        categories={categories}
        pageQuery={searchParams}
        exchangeState={exchangeState}
        currency={currency}

    ></ProductPage>
}
