import { useLocale } from "next-intl";

import NoProductPage from "@/app/[locale]/product/[id]/noProductPage";
import ProductPage from "@/app/[locale]/product/[id]/productPage";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchAttributes } from "@/utils/fetchAttributes";
import { fetchCategoryList } from "@/utils/fetchCategoryList";
import { fetchProduct } from "@/utils/fetchProduct";
import { IProductPageQuery } from "@/utils/products/iFindProductsQuery";

export interface IParametersProductId {
	id: string;
}

export default async function Product({
	params,
	searchParams,
}: {
	params: IParametersProductId;
	searchParams: IProductPageQuery;
}) {
	const locale = useLocale();
	const currency = getCurrencyStatic();

	const [maybeProduct, attributes, categories, exchangeState] = await Promise.all([
		fetchProduct(params.id, locale),
		fetchAttributes(locale),
		fetchCategoryList(locale),
		getStaticExchange(),
	]);

	return maybeProduct ? (
		<ProductPage
			product={maybeProduct}
			attributes={attributes}
			categories={categories}
			pageQuery={searchParams}
			exchangeState={exchangeState}
			currency={currency}
		></ProductPage>
	) : (
		<NoProductPage></NoProductPage>
	);
}
