import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import {getStaticExchange} from "@/shop-exchange-shared/staticStore";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";

export default async function ProductsPage() {
    const locale = useLocale();

    const [products, attributes, categories , exchangeState] = await Promise.all([
        fetchProducts(locale),
        fetchAttributes(locale),
        fetchCategoryList(locale),
        getStaticExchange(),
        ]
    );

    return <ProductsContent
        products={products}
        attributes={attributes}
        categories={categories}
        exchangeState={exchangeState}
    ></ProductsContent>
}

function ProductsContent ({ products, attributes, categories, exchangeState }: {
    products: ProductsListType,
    attributes: AttributeDto[],
    categories: CategoryDto[],
    exchangeState: ExchangeState,
}) {
    const t = useTranslations('ProductsList');
    const currency = getCurrencyStatic();

    return <div>
        <ProductsList
            defaultList={products}
            attributes={attributes}
            categories={categories}
            exchangeState={exchangeState}
            currency={currency}
        ></ProductsList>
    </div>
}
