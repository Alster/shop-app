"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { PropsWithChildren } from "react";

import CategoryTreeView from "@/components/categoryTreeView";
import CurrencySelect from "@/components/currencySelect";
import LanguageSelect from "@/components/languageSelect";
import MobileScreenViewBase from "@/components/mobileScreenViewBase";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categoriesTree.dto";
import { MobileViewScreenEnum } from "@/utils/search/mobileViewScreenEnum";
import useMobileViewScreen from "@/utils/search/useMobileViewScreen";
import useSelectedCategories from "@/utils/search/useSelectedCategories";

export default function Body({
	children,
	categories,
	selectedCategories,
	currency,
}: PropsWithChildren & {
	categories: CategoriesNodeDto[];
	selectedCategories: string[];
	currency: CurrencyEnum;
}) {
	const t = useTranslations("Mobile.Menu");

	const updateSelectedCategoriesIfNeeded = useSelectedCategories()[2];
	updateSelectedCategoriesIfNeeded(selectedCategories);

	const [currentViewScreen] = useMobileViewScreen();

	if (currentViewScreen !== MobileViewScreenEnum.Menu) {
		return <div>{children}</div>;
	}

	function MenuView() {
		return (
			<MobileScreenViewBase title={t("title")}>
				<CategoryTreeView className="p-3 lg:hidden" tree={categories}></CategoryTreeView>
				<div className="unicorn-background flex w-full items-center p-3">
					<LanguageSelect className="flex"></LanguageSelect>
					<CurrencySelect className="ml-3 flex" currency={currency}></CurrencySelect>
				</div>
			</MobileScreenViewBase>
		);
	}

	return MenuView();
}
