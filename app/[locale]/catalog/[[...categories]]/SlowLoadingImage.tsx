import Image from "next/image";
import * as React from "react";

import getImageUrl from "@/app/[locale]/catalog/[[...categories]]/getImageUrl";
import { ProductDto } from "@/shop-shared/dto/product/product.dto";
import ImagePostfixType from "@/shop-shared/utils/imagePostfixType";

export default function SlowLoadingImage({
	postfixes,
	product,
	colorInFilters,
	size,
}: {
	postfixes: [ImagePostfixType, ImagePostfixType];
	product: ProductDto;
	colorInFilters?: string[];
	size: number;
}) {
	const [suitableItemByColor] = colorInFilters
		? product.items
				.flatMap((item) =>
					colorInFilters.map((color) => ({
						score: item.attributes.color.indexOf(color),
						item,
					})),
				)
				.filter((item) => item.score !== -1)
				.sort((a, b) => a.score - b.score)
		: [undefined];

	const { itemToShow, indexToShow } =
		(product.selectedItem
			? {
					itemToShow: product.items.find((item) => item.sku === product.selectedItem),
					indexToShow: 0,
			  }
			: undefined) ??
		(suitableItemByColor
			? {
					itemToShow: suitableItemByColor.item,
					indexToShow: suitableItemByColor.score,
			  }
			: undefined) ??
		(product.items[0]
			? {
					itemToShow: product.items[0],
					indexToShow: 0,
			  }
			: {
					itemToShow: undefined,
					indexToShow: 0,
			  });

	if (!itemToShow) {
		throw new Error("No items in product");
	}

	const backgroundUrl = getImageUrl(itemToShow, postfixes[0], indexToShow);
	const mainUrl = getImageUrl(itemToShow, postfixes[1], indexToShow);

	return (
		<Image
			src={mainUrl}
			width={size}
			height={size}
			alt=""
			loading="lazy"
			className="bg-cover"
			style={{
				background: `url(${backgroundUrl}) no-repeat center`,
				backgroundSize: "cover",
				backdropFilter: "blur(10px) opacity(0.5)",
			}}
		/>
	);
}
