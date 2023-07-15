import * as React from "react";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import * as qs from "qs";
import {useSearchParams} from "next/navigation";
import {usePathname, useRouter} from "next-intl/client";
import FilterContainer from "@/components/filters/filterContainer";
import {useTranslations} from "next-intl";
import MultiRangeSlider from "@/components/multiRangeSlider/multiRangeSlider";
import {MoneyBig, moneyBigToSmall, moneySmallToBig} from "@/shop-shared/dto/primitiveTypes";

function ValueView({ value, className }: { value: number, className?: string }) {
    return (
        <span className={`${className} text-sm w-10`}>{value}</span>
    )
}

export default function PriceFilter({ defaultPriceMin, defaultPriceMax }: { defaultPriceMin: MoneyBig, defaultPriceMax: MoneyBig }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const t = useTranslations('FilterPrice');

    const staticPriceRange = { min: defaultPriceMin as number, max: defaultPriceMax as number };

    const { priceFrom: queryPriceFrom, priceTo: queryPriceTo } = qs.parse(searchParams.toString()) as IFindProductsQuery;
    const currentPriceRange = { min: (queryPriceFrom ? moneySmallToBig(queryPriceFrom) : defaultPriceMin) as number, max: (queryPriceTo ? moneySmallToBig(queryPriceTo) : defaultPriceMax) as number };
    const onePercent = (staticPriceRange.max - staticPriceRange.min) / 100;
    const currentSliderRange = { min: Math.floor((currentPriceRange.min - staticPriceRange.min) / onePercent), max: Math.ceil((currentPriceRange.max - staticPriceRange.min) / onePercent) };

    const formatValue = (val: number) => {
        return staticPriceRange.min + ((staticPriceRange.max - staticPriceRange.min) * (val / 100));
    }

    return (
        <FilterContainer
            title={t("title")}
            selectedCount={0}
            className="flex items-center"
        >
            <MultiRangeSlider
                min={0}
                max={100}
                defaultMinVal={currentSliderRange.min}
                defaultMaxVal={currentSliderRange.max}
                onChange={(range) => {
                    const newQuery = {
                        ...qs.parse(searchParams.toString()) as any,
                        priceFrom: moneyBigToSmall(Math.floor(formatValue(range.min))),
                        priceTo: moneyBigToSmall(Math.ceil(formatValue(range.max)))
                    };
                    const newParams = qs.stringify(newQuery);
                    const targetHref = `${pathname}?${newParams}`
                    router.push(targetHref);
                }}
                className="p-2"
                valueFrom={(val) => <ValueView value={Math.floor(formatValue(val))} className="text-right"></ValueView>}
                valueTo={(val) => <ValueView value={Math.ceil(formatValue(val))}></ValueView>}
            />
        </FilterContainer>
    )
}
