"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Fragment } from "react";

import ProductsList from "@/app/[locale]/catalog/[[...categories]]/productsList";
import CategoryTreeView from "@/components/categoryTreeView";
import CurrencySelect from "@/components/currencySelect";
import AttributeFilter from "@/components/filters/attributeFilter";
import PriceFilter from "@/components/filters/priceFilter";
import SortFilter from "@/components/filters/sortFilter";
import LanguageSelect from "@/components/languageSelect";
import StatusInfo from "@/components/statusInfo";
import TextSearchDesktop from "@/components/textSearchDesktop";
import TextSearchMobile from "@/components/textSearchMobile";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categoriesTree.dto";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductListResponseDto } from "@/shop-shared/dto/product/productList.response.dto";
import useMobileViewScreen, { MobileViewScreenEnum } from "@/utils/seearch/useMobileViewScreen";

export default function CatalogController({
	productsResponseEncoded,
	attributes,
	categories,
	selectedCategories,
	exchangeState,
	currency,
}: {
	productsResponseEncoded: string;
	attributes: AttributeDto[];
	categories: CategoriesNodeDto[];
	selectedCategories: string[];
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	console.log(`render view`);
	const t = useTranslations("ProductsList");
	const [currentViewScreen, setCurrentViewScreen] = useMobileViewScreen();

	const productsResponse: ProductListResponseDto = JSON.parse(productsResponseEncoded);

	const colorInFilters = productsResponse.filters.color || [];

	function Categories() {
		return (
			<div className="flex">
				<CategoryTreeView
					className="hidden lg:block"
					tree={categories}
					selectedCategories={selectedCategories}
				></CategoryTreeView>
			</div>
		);
	}

	function FiltersDesktop({ className }: { className?: string }) {
		return (
			<div className={`${className} flex flex-wrap items-center`}>
				<TextSearchDesktop className="hidden lg:flex"></TextSearchDesktop>
				<SortFilter></SortFilter>
				<PriceFilter
					defaultPriceMin={moneySmallToBig(productsResponse.priceMin)}
					defaultPriceMax={moneySmallToBig(productsResponse.priceMax)}
				></PriceFilter>
				{Object.entries(productsResponse.filters).map(([key, values]) => (
					<AttributeFilter
						key={key}
						values={values}
						attributeInfo={attributes.find((a) => a.key === key)}
					></AttributeFilter>
				))}
			</div>
		);
	}

	function FiltersButtonMobile({
		className,
		toggle,
	}: {
		className?: string;
		toggle: () => void;
	}) {
		return (
			<Fragment>
				<div className={`${className} flex flex-wrap`}>
					<button
						onClick={() => toggle()}
						className="
                                flex h-12 w-full items-center justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
					>
						<div className="flex items-center">
							<AdjustmentsHorizontalIcon className="inline-block h-10 w-10"></AdjustmentsHorizontalIcon>
							<div>Filters</div>
						</div>
					</button>
				</div>
			</Fragment>
		);
	}

	function CatalogView() {
		return (
			<Fragment>
				<TextSearchMobile className="flex lg:hidden"></TextSearchMobile>
				<FiltersButtonMobile
					toggle={() => setCurrentViewScreen(MobileViewScreenEnum.Filters)}
					className="flex lg:hidden"
				></FiltersButtonMobile>
				<div className="flex">
					<Categories></Categories>
					<div>
						<FiltersDesktop className="hidden lg:flex"></FiltersDesktop>
						{productsResponse.products.length === 0 && (
							<StatusInfo
								iconConfig={{
									icon: <MagnifyingGlassIcon></MagnifyingGlassIcon>,
									textColor: "text-white-400",
									backgroundColor: "bg-gray-400",
								}}
								title={t("emptyProductsList")}
								description={t("emptyProductsListDescription")}
							></StatusInfo>
						)}
						<ProductsList
							products={productsResponse.products}
							colorInFilters={colorInFilters}
							attributes={attributes}
							currency={currency}
							exchangeState={exchangeState}
						></ProductsList>
					</div>
				</div>
			</Fragment>
		);
	}

	function MobileScreenViewBase({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) {
		return (
			<div className="fixed top-0 h-full w-full">
				<div className="flex h-full w-full flex-col bg-white dark:bg-slate-800">
					<div className="flex">
						<div className="flex items-center pl-4 text-xl">{title}</div>
						<button
							onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Catalog)}
							className="
                                flex h-16 w-16 flex-auto items-center justify-end font-medium uppercase tracking-wider
                             "
						>
							<div className="flex items-center">
								<XMarkIcon className="inline-block h-12 w-12"></XMarkIcon>
							</div>
						</button>
					</div>
					{children}
				</div>
			</div>
		);
	}

	function FiltersView() {
		return (
			<MobileScreenViewBase title="Filters">
				<SortFilter></SortFilter>
				<PriceFilter
					defaultPriceMin={moneySmallToBig(productsResponse.priceMin) as number}
					defaultPriceMax={moneySmallToBig(productsResponse.priceMax) as number}
				></PriceFilter>
				{Object.entries(productsResponse.filters).map(([key, values]) => (
					<AttributeFilter
						key={key}
						values={values}
						attributeInfo={attributes.find((a) => a.key === key)}
					></AttributeFilter>
				))}
			</MobileScreenViewBase>
		);
	}

	function MenuView() {
		return (
			<MobileScreenViewBase title="Menu">
				<CategoryTreeView
					className="lg:hidden"
					tree={categories}
					selectedCategories={selectedCategories}
				></CategoryTreeView>
				<div className="unicorn-background flex">
					<LanguageSelect></LanguageSelect>
					<CurrencySelect
						currency={currency}
						exchangeState={exchangeState}
					></CurrencySelect>
				</div>
			</MobileScreenViewBase>
		);
	}

	const ConfigToScreen = {
		[MobileViewScreenEnum.Catalog]: CatalogView,
		[MobileViewScreenEnum.Filters]: FiltersView,
		[MobileViewScreenEnum.Menu]: MenuView,
	};

	return { ...ConfigToScreen[currentViewScreen]() };
}
