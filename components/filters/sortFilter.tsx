import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as qs from "qs";
import * as React from "react";

import FilterContainer from "@/components/filters/filterContainer";
import { Link, usePathname } from "@/navigation";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

interface IValue {
	key: string;
	field: string;
	direction: "asc" | "desc";
}

const values = [
	{ key: "priceLowToHigh", field: "price", direction: "asc" },
	{ key: "priceHighToLow", field: "price", direction: "desc" },
	{ key: "newToOld", field: "createDate", direction: "desc" },
] as const satisfies IValue[];

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
						className={`m-1 border border-black px-2 py-1 dark:border-white ${
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
