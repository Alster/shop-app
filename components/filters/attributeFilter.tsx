import { useSearchParams } from "next/navigation";
import * as qs from "qs";
import * as React from "react";

import FilterContainer from "@/components/filters/filterContainer";
import { Link, usePathname } from "@/navigation";
import { AttributesEnum } from "@/shop-shared/constants/attributesEnum";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

export default function AttributeFilter({
	values,
	attributeInfo,
}: {
	values: string[];
	attributeInfo?: AttributeDto;
}) {
	const pathname = usePathname();
	const searchParameters = useSearchParams();

	if (!attributeInfo) {
		return;
	}

	const localeValue = (key: string) => {
		return attributeInfo.values.find((v) => v.key === key)?.title || key;
	};

	const getAttributesFromQuery = () => {
		const pq = qs.parse(searchParameters.toString()) as IFindProductsQuery;
		const attributes: Record<string, string[]> = {};
		for (const attribute of pq.attrs || []) {
			attributes[attribute.key] = [...attribute.values];
		}
		return attributes;
	};

	const getLinkFromAttributes = (attributes: Record<string, string[]>) => {
		const parameters: IFindProductsQuery = {
			...(qs.parse(searchParameters.toString()) as IFindProductsQuery),
			attrs: Object.entries(attributes).map(([key, values]) => ({ key, values })),
		};
		return pathname + "?" + qs.stringify(parameters);
	};

	const getToggledLink = (key: string, value: string) => {
		const attributes = getAttributesFromQuery();

		if (attributes[key]) {
			if (attributes[key].includes(value)) {
				attributes[key] = attributes[key].filter((v: string) => v !== value);
				if (attributes[key].length === 0) {
					delete attributes[key];
				}
			} else {
				attributes[key] = [...new Set([...attributes[key], value])];
			}
		} else {
			attributes[key] = [value];
		}

		return getLinkFromAttributes(attributes);
	};

	const selected =
		(qs.parse(searchParameters.toString()) as IFindProductsQuery).attrs?.find(
			(attribute) => attribute.key === attributeInfo.key,
		)?.values || [];

	return (
		<FilterContainer title={attributeInfo.title} selectedCount={selected.length}>
			{values.map((value) => {
				if (attributeInfo.key === AttributesEnum.COLOR) {
					const style = getStyleByColorCode(value);
					return (
						<Link
							key={value}
							href={getToggledLink(attributeInfo.key, value)}
							className={`
                                            m-1 h-8 w-8 border border-black 
                                            p-2 dark:border-white 
                                            ${selected.includes(value) ? "border-4" : ""}
                                            ${
												selected.includes(value)
													? "outline outline-2 outline-black dark:outline-white"
													: ""
											}
                                            `}
							style={style}
						></Link>
					);
				}

				return (
					<Link
						key={value}
						href={getToggledLink(attributeInfo.key, value)}
						className={`m-1 border border-black px-2 py-1 dark:border-white ${
							selected.includes(value) ? "unicorn-background" : ""
						}`}
					>
						{localeValue(value)}
					</Link>
				);
			})}
		</FilterContainer>
	);
}
