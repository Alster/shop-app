import Image from "next/image";
import * as React from "react";

import getImageUrl from "@/app/[locale]/catalog/[[...categories]]/getImageUrl";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import ImagePostfixType from "@/shop-shared/utils/imagePostfixType";

export default function SlowLoadingImage({
	postfixes,
	product,
	itemToShow,
	indexToShow,
	size,
}: {
	postfixes: [ImagePostfixType, ImagePostfixType];
	product: ProductDto;
	itemToShow?: ProductItemDto | null;
	indexToShow?: number;
	size: number;
}) {
	if (!itemToShow) {
		return <>no items here</>;
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
