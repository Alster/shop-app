import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import * as qs from "qs";
import * as React from "react";

import FilterContainer from "@/components/filters/filterContainer";
import MultiRangeSlider from "@/components/multiRangeSlider/multiRangeSlider";
import { MoneyBig, moneyBigToSmall, moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

function ValueView({ value, className }: { value: number; className?: string }) {
	return <span className={`${className} text-sm w-10`}>{value}</span>;
}

export default function PriceFilter({
	defaultPriceMin,
	defaultPriceMax,
}: {
	defaultPriceMin: MoneyBig;
	defaultPriceMax: MoneyBig;
}) {
	const pathname = usePathname();
	const searchParameters = useSearchParams();
	const router = useRouter();
	const t = useTranslations("FilterPrice");

	const staticPriceRange = { min: defaultPriceMin as number, max: defaultPriceMax as number };

	const { priceFrom: queryPriceFrom, priceTo: queryPriceTo } = qs.parse(
		searchParameters.toString(),
	) as IFindProductsQuery;

	const currentPriceRange = {
		min: (queryPriceFrom ? moneySmallToBig(queryPriceFrom) : defaultPriceMin) as number,
		max: (queryPriceTo ? moneySmallToBig(queryPriceTo) : defaultPriceMax) as number,
	};

	const onePercent = (staticPriceRange.max - staticPriceRange.min) / 100;

	const currentSliderRange = {
		min: onePercent
			? Math.floor((currentPriceRange.min - staticPriceRange.min) / onePercent)
			: 0,
		max: onePercent
			? Math.ceil((currentPriceRange.max - staticPriceRange.min) / onePercent)
			: 100,
	};

	const formatValue = (value: number) => {
		return staticPriceRange.min + (staticPriceRange.max - staticPriceRange.min) * (value / 100);
	};

	return (
		<FilterContainer
			title={t("title")}
			selectedCount={currentSliderRange.min !== 0 || currentSliderRange.max !== 100 ? 1 : 0}
			className="flex items-center"
		>
			<MultiRangeSlider
				min={0}
				max={100}
				defaultMinVal={currentSliderRange.min}
				defaultMaxVal={currentSliderRange.max}
				onChange={(range) => {
					if (
						range.min === currentSliderRange.min &&
						range.max === currentSliderRange.max
					) {
						return;
					}

					if (range.min === 0 && range.max === 100 && queryPriceFrom && queryPriceTo) {
						const newQuery: IFindProductsQuery = {
							...(qs.parse(searchParameters.toString()) as IFindProductsQuery),
							priceFrom: undefined,
							priceTo: undefined,
						};
						const newParameters = qs.stringify(newQuery);
						const targetHref = `${pathname}?${newParameters}`;
						router.push(targetHref);
						return;
					}

					const newQuery: IFindProductsQuery = {
						...(qs.parse(searchParameters.toString()) as IFindProductsQuery),
						priceFrom: moneyBigToSmall(Math.floor(formatValue(range.min))),
						priceTo: moneyBigToSmall(Math.ceil(formatValue(range.max))),
					};
					const newParameters = qs.stringify(newQuery);
					const targetHref = `${pathname}?${newParameters}`;
					router.push(targetHref);
				}}
				className="p-2"
				valueFrom={(value) => (
					<ValueView
						value={Math.floor(formatValue(value))}
						className="text-right"
					></ValueView>
				)}
				valueTo={(value) => <ValueView value={Math.ceil(formatValue(value))}></ValueView>}
			/>
		</FilterContainer>
	);
}
