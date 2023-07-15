import * as React from "react";
import Link from "next-intl/link";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import * as qs from "qs";
import {useSearchParams} from "next/navigation";
import {usePathname} from "next-intl/client";
import FilterContainer from "@/components/filters/filterContainer";
import {useTranslations} from "next-intl";

interface IValue {
    key: string;
    field: string;
    direction: "asc" | "desc";
}

const values: IValue[] = [
    { key: "priceLowToHigh", field: "price", direction: "asc" },
    { key: "priceHighToLow", field: "price", direction: "desc" },
    { key: "newToOld", field: "createDate", direction: "desc" },
];

export default function SortFilter({}: {}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('FilterSort');

    function getHrefForValue(value: IValue) {
        return pathname + "?" + qs.stringify({
            ...qs.parse(searchParams.toString()),
            sortField: value.field,
            sortOrder: value.direction,
        });
    }

    const { sortField, sortOrder } = qs.parse(searchParams.toString()) as IFindProductsQuery;
    const selected = values.find(v => v.field === sortField && v.direction === sortOrder)

    return (
        <FilterContainer
            title={t("title")}
            selectedCount={0}
        >
            {values.map((value) => {
                return (
                    <Link
                        key={value.key}
                        href={getHrefForValue(value)}
                        className={`px-2 py-1 m-1 border border-black dark:border-white ${(selected && selected.key === value.key) ? "unicorn-background" : ""}`}
                    >
                        {t(value.key)}
                    </Link>
                )
            })}
        </FilterContainer>
    )
}
