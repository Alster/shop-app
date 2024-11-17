"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { PropsWithChildren } from "react";

import CategoryTreeView from "@/components/categoryTreeView";
import CurrencySelect from "@/components/currencySelect";
import LanguageSelect from "@/components/languageSelect";
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

	const [currentViewScreen, setCurrentViewScreen] = useMobileViewScreen();

	if (currentViewScreen !== MobileViewScreenEnum.Menu) {
		return <div>{children}</div>;
	}

	function MobileScreenViewBase({
		title,
		children,
	}: {
		title: string;
		children: React.ReactNode;
	}) {
		return (
			<div className="fixed top-0 size-full">
				<div className="flex size-full flex-col bg-white dark:bg-slate-800">
					<div className="flex">
						<div className="flex items-center pl-4 text-xl">{title}</div>
						<button
							onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Catalog)}
							className="
                                flex size-16 flex-auto items-center justify-end font-medium uppercase tracking-wider
                             "
						>
							<div className="flex items-center">
								<XMarkIcon className="inline-block size-12"></XMarkIcon>
							</div>
						</button>
					</div>
					{children}
				</div>
			</div>
		);
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
