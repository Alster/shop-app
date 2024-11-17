"use client";

import * as React from "react";
import { PropsWithChildren } from "react";

import CategoryTreeView from "@/components/categoryTreeView";
import CurrencySelect from "@/components/currencySelect";
import LanguageSelect from "@/components/languageSelect";
import MobileScreenViewBase from "@/components/mobileScreenViewBase";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categoriesTree.dto";
import { MobileViewScreenEnum } from "@/utils/search/mobileViewScreenEnum";
import useMobileViewScreen from "@/utils/search/useMobileViewScreen";
import useSelectedCategories from "@/utils/search/useSelectedCategories";

export default function Body({
	children,
	categories,
	selectedCategories,
	exchangeState,
	currency,
}: PropsWithChildren & {
	categories: CategoriesNodeDto[];
	selectedCategories: string[];
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const updateSelectedCategoriesIfNeeded = useSelectedCategories()[2];
	updateSelectedCategoriesIfNeeded(selectedCategories);

	const [currentViewScreen] = useMobileViewScreen();

	if (currentViewScreen !== MobileViewScreenEnum.Menu) {
		return <div>{children}</div>;
	}

	function MenuView() {
		return (
			<MobileScreenViewBase title="Menu">
				<CategoryTreeView className="lg:hidden" tree={categories}></CategoryTreeView>
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

	return MenuView();
}
