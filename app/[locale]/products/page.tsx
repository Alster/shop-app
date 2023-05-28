import {ProductsListType} from "@/app/api/products/route";
import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter} from 'next-intl';

export default async function Products() {
    const res = await fetch(`http://localhost:3000/api/products`);
    const data = await res.json();
    const products: ProductsListType = data.products;

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
