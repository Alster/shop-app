import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import Link from "next-intl/link";
import * as qs from "qs";
import * as React from "react";

import FilterContainer from "@/components/filters/filterContainer";
import { IFindProductsQuery } from "@/utils/products/parseQuery";

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

export default function SortFilter() {
	const pathname = usePathname();
	const searchParameters = useSearchParams();
	const t = useTranslations("FilterSort");

	function getHrefForValue(value: IValue) {
		return (
			pathname +
			"?" +
			qs.stringify({
				...qs.parse(searchParameters.toString()),
				sortField: value.field,
				sortOrder: value.direction,
			})
		);
	}

	const { sortField, sortOrder } = qs.parse(searchParameters.toString()) as IFindProductsQuery;
	const selected = values.find((v) => v.field === sortField && v.direction === sortOrder);

	return (
		<FilterContainer title={t("title")} selectedCount={0}>
			{values.map((value) => {
				return (
					<Link
						key={value.key}
						href={getHrefForValue(value)}
						className={`px-2 py-1 m-1 border border-black dark:border-white ${
							selected && selected.key === value.key ? "unicorn-background" : ""
						}`}
					>
						{t(value.key)}
					</Link>
				);
			})}
		</FilterContainer>
	);
}
