import Image from "next/image";
import * as React from "react";

import getImageUrl from "@/app/[locale]/catalog/[[...categories]]/getImageUrl";
import { ProductDto } from "@/shop-shared/dto/product/product.dto";
import ImagePostfixType from "@/shop-shared/utils/imagePostfixType";

export default function SlowLoadingImage({
	postfixes,
	product,
	number,
	size,
}: {
	postfixes: [ImagePostfixType, ImagePostfixType];
	product: ProductDto;
	number?: number;
	size: number;
}) {
	const backgroundUrl = getImageUrl(product, postfixes[0], product.selectedColor, number);
	const mainUrl = getImageUrl(product, postfixes[1], product.selectedColor, number);
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
