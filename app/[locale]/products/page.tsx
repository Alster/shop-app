import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";

export default async function Products() {
    const locale = useLocale();

    const [products, attributes, categories ] = await Promise.all([
        fetchProducts(locale),
        fetchAttributes(locale),
        fetchCategoryList(locale)]
    );

    return <ProductsContent
        products={products}
        attributes={attributes}
        categories={categories}
    ></ProductsContent>
}

function ProductsContent ({ products, attributes, categories }: {
    products: ProductsListType,
    attributes: AttributeDto[],
    categories: CategoryDto[],
}) {
    const t = useTranslations('ProductsList');

    return <div>
        {t("hello")}
        <ProductsList
            defaultList={products}
            attributes={attributes}
            categories={categories}
        ></ProductsList>
    </div>
}
