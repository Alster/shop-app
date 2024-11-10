import { setRequestLocale } from "next-intl/server";

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
	params: Promise<IParametersCategories>;
	searchParams: Promise<IFindProductsQuery>;
}) {
	const { locale, categories } = await params;
	const searchParametersAwaited = await searchParams;
	setRequestLocale(locale);

	const currency = await getCurrencyStatic();

	const selectedCategories = categories && categories.length > 0 ? categories : [];

	const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
		fetchProducts(locale, {
			...searchParametersAwaited,
			categories: [selectedCategories.join("/")],
		}),
		fetchAttributes(locale),
		getStaticExchange(),
		fetchCategoryTree(locale),
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
