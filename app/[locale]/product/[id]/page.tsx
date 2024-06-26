import { unstable_setRequestLocale } from "next-intl/server";

import NoProductPage from "@/app/[locale]/product/[id]/noProductPage";
import ProductPage from "@/app/[locale]/product/[id]/productPage";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchAttributes } from "@/utils/fetchAttributes";
import { fetchProduct } from "@/utils/fetchProduct";
import { IProductPageQuery } from "@/utils/products/iFindProductsQuery";

export interface IParametersProductId {
	id: string;
	locale: string;
}

export default async function Product({
	params,
	searchParams,
}: {
	params: IParametersProductId;
	searchParams: IProductPageQuery;
}) {
	unstable_setRequestLocale(params.locale);
	const currency = getCurrencyStatic();

	const [maybeProduct, attributes, exchangeState] = await Promise.all([
		fetchProduct(params.id, params.locale),
		fetchAttributes(params.locale),
		getStaticExchange(),
	]);

	return maybeProduct ? (
		<ProductPage
			product={maybeProduct}
			attributes={attributes}
			pageQuery={searchParams}
			exchangeState={exchangeState}
			currency={currency}
		></ProductPage>
	) : (
		<NoProductPage></NoProductPage>
	);
}
