import { useFormatter, useLocale, useTranslations } from "next-intl";

import ProductsList from "@/app/[locale]/catalog/old/productsList";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { getStaticExchange } from "@/shop-exchange-shared/staticStore";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categories-tree.dto";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchAttributes } from "@/utils/fetchAttributes";
import { fetchCategoryTree } from "@/utils/fetchCategoryTree";
import { fetchProducts } from "@/utils/fetchProducts";
import { IFindProductsQuery } from "@/utils/products/parseQuery";

export interface Parameters_Categories {
	categories: string[];
}

export default async function ProductsPage({
	params,
	searchParams,
}: {
	params: Parameters_Categories;
	searchParams: IFindProductsQuery;
}) {
	const locale = useLocale();

	const selectedCategories =
		params.categories && params.categories.length > 0 ? params.categories : [];

	console.log(
		"ProductsPage searchParams",
		JSON.stringify(searchParams, null, 2),
		"locale",
		locale,
	);

	const [productsResponse, attributes, exchangeState, categoryTree] = await Promise.all([
		fetchProducts(locale, { ...searchParams, categories: [selectedCategories.join("/")] }),
		fetchAttributes(locale),
		getStaticExchange(),
		fetchCategoryTree(locale),
	]);

	return (
		<ProductsContent
			productsResponseEncoded={JSON.stringify(productsResponse)}
			attributes={attributes}
			categories={categoryTree}
			exchangeState={exchangeState}
			pageQueryEncoded={JSON.stringify(searchParams)}
			selectedCategories={selectedCategories}
		></ProductsContent>
	);
}

function ProductsContent(properties: {
	productsResponseEncoded: string;
	attributes: AttributeDto[];
	categories: CategoriesNodeDto[];
	exchangeState: ExchangeState;
	pageQueryEncoded: string;
	selectedCategories: string[];
}) {
	const t = useTranslations("ProductsList");
	const currency = getCurrencyStatic();

	return (
		<div>
			<ProductsList {...properties} currency={currency}></ProductsList>
		</div>
	);
}
