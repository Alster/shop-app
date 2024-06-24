import * as React from "react";

import { Link } from "@/navigation";
import { AttributesEnum } from "@/shop-shared/constants/attributesEnum";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";

export default function Item({
	item,
	product,
	isSelected,
}: {
	item: ProductItemDto;
	product: ProductDto;
	isSelected: boolean;
}) {
	const colors = item.attributes[AttributesEnum.COLOR] || [];
	const [size] =
		item.attributes[AttributesEnum.SIZE] || item.attributes[AttributesEnum.SIZE_SHOES] || [];

	return (
		<Link
			replace={true}
			href={`/product/${product.publicId}?item=${item.sku}`}
			className={`product-item flex gap-0 border-2 ${
				isSelected
					? "border-white bg-black text-white dark:border-black dark:bg-white dark:text-black"
					: "border-white bg-white text-black dark:border-black dark:bg-black dark:text-white"
			} hover:border-gray-300 hover:dark:border-gray-500`}
		>
			{size && (
				<div className="flex h-9 items-center justify-center p-3 font-bold uppercase">
					{size}
				</div>
			)}
			{colors.map((color, index) => (
				<div
					key={`color+${index + 1}`}
					className="h-9 w-9 border-2 border-gray-300 dark:border-gray-700"
					style={getStyleByColorCode(color)}
				></div>
			))}
		</Link>
	);
}
