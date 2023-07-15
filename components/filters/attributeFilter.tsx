import {AttributeDto} from "@/shop-shared/dto/product/attribute.dto";
import * as React from "react";
import {ATTRIBUTES} from "@/app/constants";
import {getStyleByColorCode} from "@/utils/products/getStyleByColorCode";
import Link from "next-intl/link";
import {IFindProductsQuery} from "@/utils/products/parseQuery";
import * as qs from "qs";
import {useSearchParams} from "next/navigation";
import {usePathname} from "next-intl/client";
import FilterContainer from "@/components/filters/filterContainer";

export default function AttributeFilter({ values, attributeInfo}: {
    values: string[],
    attributeInfo?: AttributeDto,
}) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    if (!attributeInfo) {
        return null
    }

    const localeValue = (key: string) => {
        return attributeInfo.values.find((v) => v.key === key)?.title || key;
    };

    const getAttrsFromQuery = () => {
        const pq = qs.parse(searchParams.toString()) as IFindProductsQuery;
        const attrs: Record<string, string[]> = {};
        (pq.attrs || []).forEach((attr) => {
            attrs[attr.key] = [...attr.values];
        });
        return attrs;
    }

    const getLinkFromAttributes = (attrs: Record<string, string[]>) => {
        return pathname + "?" + qs.stringify({
            ...(qs.parse(searchParams.toString()) as any),
            attrs: Object.entries(attrs).map(([key, values]) => ({key, values}))
        });
    }

    const getToggledLink = (key: string, value: string) => {
        const attrs = getAttrsFromQuery();

        if (attrs[key]) {
            if (attrs[key].includes(value)) {
                attrs[key] = attrs[key].filter((v: string) => v !== value);
                if (attrs[key].length === 0) {
                    delete attrs[key];
                }
            } else {
                attrs[key] = Array.from((new Set([...attrs[key], value])));
            }
        } else {
            attrs[key] = [value];
        }

        return getLinkFromAttributes(attrs);
    }

    const selected = (qs.parse(searchParams.toString()) as IFindProductsQuery)
        .attrs?.find((attr: any) => attr.key === attributeInfo.key)?.values || [];

    return (
        <FilterContainer
            title={attributeInfo.title}
            selectedCount={selected.length}
        >
            {values.map((value) => {
                if (attributeInfo.key === ATTRIBUTES.COLOR) {
                    const style = getStyleByColorCode(value);
                    return (
                        <Link
                            key={value}
                            href={getToggledLink(attributeInfo.key, value)}
                            className={`
                                            px-2 py-2 m-1 w-8 h-8 
                                            border border-black dark:border-white 
                                            ${selected.includes(value) ? "border-4" : ""}
                                            ${selected.includes(value) ? "outline outline-black dark:outline-white outline-2" : ""}
                                            `}
                            style={style}
                        >
                        </Link>
                    )
                }

                return (
                    <Link
                        key={value}
                        href={getToggledLink(attributeInfo.key, value)}
                        className={`px-2 py-1 m-1 border border-black dark:border-white ${selected.includes(value) ? "unicorn-background" : ""}`}
                    >
                        {localeValue(value)}
                    </Link>
                )
            })}
        </FilterContainer>
    )
}
