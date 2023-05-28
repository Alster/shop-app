import {getProductsList, ProductsListType} from "@/app/api/products/route";
import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter} from 'next-intl';

export default async function Products() {
    const products: ProductsListType = await getProductsList();

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
