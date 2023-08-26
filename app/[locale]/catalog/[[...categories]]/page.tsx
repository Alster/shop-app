import { useLocale } from "next-intl";

import CatalogController from "@/app/[locale]/catalog/[[...categories]]/catalogController";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchAttributes } from "@/utils/fetchAttributes";
import { fetchCategoryTree } from "@/utils/fetchCategoryTree";
import { fetchProducts } from "@/utils/fetchProducts";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

interface IParametersCategories {
	categories: string[];
}

export default async function CatalogPage({
	params,
	searchParams,
}: {
	params: IParametersCategories;
	searchParams: IFindProductsQuery;
}) {
	console.log("render static");
	const locale = useLocale();
	const currency = getCurrencyStatic();

	const selectedCategories =
		params.categories && params.categories.length > 0 ? params.categories : [];

	const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
		fetchProducts(locale, { ...searchParams, categories: [selectedCategories.join("/")] }),
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
