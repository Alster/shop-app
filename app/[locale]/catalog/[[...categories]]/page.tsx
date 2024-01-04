import { unstable_setRequestLocale } from "next-intl/server";

import CatalogController from "@/app/[locale]/catalog/[[...categories]]/catalogController";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchAttributes } from "@/utils/fetchAttributes";
import { fetchCategoryTree } from "@/utils/fetchCategoryTree";
import { fetchProducts } from "@/utils/fetchProducts";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

interface IParametersCategories {
	categories: string[];
	locale: string;
}

export default async function CatalogPage({
	params,
	searchParams,
}: {
	params: IParametersCategories;
	searchParams: IFindProductsQuery;
}) {
	unstable_setRequestLocale(params.locale);

	const currency = getCurrencyStatic();

	const selectedCategories =
		params.categories && params.categories.length > 0 ? params.categories : [];

	const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
		fetchProducts(params.locale, {
			...searchParams,
			categories: [selectedCategories.join("/")],
		}),
		fetchAttributes(params.locale),
		getStaticExchange(),
		fetchCategoryTree(params.locale),
	]);

	return (
		<CatalogController
			productsResponseEncoded={JSON.stringify(productsResponse)}
			attributes={attributes}
			categories={categoryTree}
			selectedCategories={selectedCategories}
			exchangeState={exchangeState}
			currency={currency}
		></CatalogController>
	);
}
