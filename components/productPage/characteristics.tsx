import * as React from "react";
import { ReactElement } from "react";

import AttributeTitle from "@/components/productPage/attributeTitle";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductDto } from "@/shop-shared/dto/product/product.dto";

export default function Characteristics({
	className,
	product,
	attributes,
}: {
	className?: string;
	product: ProductDto;
	attributes: AttributeDto[];
}) {
	const characteristicsKeys = Object.keys(product.characteristics);
	if (characteristicsKeys.length === 0) {
		return;
	}

	const characteristics = characteristicsKeys
		.map((key) => attributes.find((attribute) => attribute.key === key))
		.filter((attribute): attribute is AttributeDto => !!attribute);

	return (
		<div className={className}>
			{characteristics.map((attribute) => (
				<div key={attribute.key} className="my-2 flex">
					<AttributeTitle
						title={attribute?.title + ":"}
						highlightMustSelect={false}
						highlightText={""}
					></AttributeTitle>
					<div className="pl-3">
						{(product.attrs[attribute.key] || [])
							.map((value) => {
								return (
									<span key={value}>
										{
											attribute?.values.find((value_) => value_.key === value)
												?.title
										}
									</span>
								);
							})
							.reduce((previous, element) => {
								if (previous.length > 0) {
									previous.push(<span>, </span>);
								}
								previous.push(element);
								return previous;
							}, [] as ReactElement[])}
					</div>
				</div>
			))}
		</div>
	);
}
