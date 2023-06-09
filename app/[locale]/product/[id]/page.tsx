import {useLocale} from "next-intl";
import {fetchProducts} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {fetchProduct} from "@/utils/fetchProduct";
import ProductPage from "@/app/[locale]/product/[id]/productPage";
import {getCookieStatic} from "@/utils/exchange/getCurrencyStatic";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getStaticExchange} from "@/utils/exchange/staticStore";

export interface Params_ProductId {
    id: string
}

export default async function Product({ params, searchParams }: { params: Params_ProductId, searchParams: any }) {
    const locale = useLocale();
    const currencyStatic = getCookieStatic("currency");
    const currency = currencyStatic?.value as CURRENCY || CURRENCY.UAH;

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
