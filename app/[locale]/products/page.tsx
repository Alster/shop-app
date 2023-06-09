import ProductsList from "@/app/[locale]/products/productsList";
import {useTranslations, useFormatter, useLocale} from 'next-intl';
import {fetchProducts, ProductsListType} from "@/utils/fetchProducts";
import {fetchAttributes} from "@/utils/fetchAttributes";
import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import {fetchCategoryList} from "@/utils/fetchCategoryList";
import {CategoryDto} from "@/shop-shared/dto/category/category.dto";
import {getStaticExchange} from "@/utils/exchange/staticStore";
import {ExchangeState} from "@/utils/exchange/helpers";
import {getCookieStatic} from "@/utils/exchange/getCurrencyStatic";
import {CURRENCY} from "@/shop-shared/constants/exchange";

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
    const currencyStatic = getCookieStatic("currency");
    const currency = currencyStatic?.value as CURRENCY || CURRENCY.UAH;

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
