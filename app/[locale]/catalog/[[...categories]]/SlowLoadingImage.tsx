import Image from "next/image";
import * as React from "react";
import { useState } from "react";

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
	const [imageIndex, setImageIndex] = useState(indexToShow || 0);

	function RenderItem({ item }: { item: ProductItemDto }) {
		const backgroundUrl = getImageUrl(item, postfixes[0], imageIndex);
		const mainUrl = getImageUrl(item, postfixes[1], imageIndex);

		return (
			<div>
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
			</div>
		);
	}

	function RenderNoItem() {
		return (
			<div className="flex flex-col items-center justify-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300">
					<span className="text-3xl font-bold">?</span>
				</div>
				<span className="text-sm text-gray-500">No item</span>
			</div>
		);
	}

	return itemToShow ? <RenderItem item={itemToShow} /> : <RenderNoItem />;
}
