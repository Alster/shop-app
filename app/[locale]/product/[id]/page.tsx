import {useLocale} from "next-intl";
import {fetchProducts} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {fetchProduct} from "@/utils/fetchProduct";
import ProductPage from "@/app/[locale]/product/[id]/productPage";

export interface Params_ProductId {
    id: string
}

export default async function Product({ params, searchParams }: { params: Params_ProductId, searchParams: any }) {
    const locale = useLocale();

    const [product, attributes, categories ] = await Promise.all([
        fetchProduct(params.id, locale),
        fetchAttributes(locale),
        fetchCategoryList(locale)]
    );

    return <ProductPage product={product} attributes={attributes} categories={categories} pageQuery={searchParams}></ProductPage>
}
