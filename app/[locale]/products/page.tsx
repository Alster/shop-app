import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";

export default async function Products() {
    const locale = useLocale();

    const products: ProductsListType = await fetchProducts(locale);
    console.log(products)

    return <ProductsContent
        products={products}
    ></ProductsContent>
}

function ProductsContent ({ products }: {
    products: ProductsListType,
}) {
    const t = useTranslations('ProductsList');

    return <div>
        {t("hello")}
        <ProductsList
            defaultList={products}
        ></ProductsList>
    </div>
}
