"use client";

import "./lazy-images.css";
import "./productsList.css";

import * as React from "react";

import SlowLoadingImage from "@/app/[locale]/catalog/[[...categories]]/SlowLoadingImage";
import { Link } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { AttributesEnum } from "@/shop-shared/constants/attributesEnum";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";

export default function ProductsList({
	products,
	colorInFilters,
	attributes,
	currency,
	exchangeState,
}: {
	products: ProductDto[];
	colorInFilters: string[];
	attributes: AttributeDto[];
	currency: CurrencyEnum;
	exchangeState: ExchangeState;
}) {
	const [changeProductColorState, setChangeProductColorState] = React.useState("asmndnamfbnasd");
	// function AttributesLine({ product, className }: { product: ProductDto; className: string }) {
	// 	const colorValues = product.attrs[AttributesEnum.COLOR] || [];
	//
	// 	let sizeKey = "";
	// 	let sizeValues: string[] = [];
	// 	const foundSizeAttributes = Object.entries(product.attrs).filter(([key]) =>
	// 		SIZE_ATTRS.includes(key as AttributesEnum),
	// 	);
	// 	if (foundSizeAttributes.length > 0) {
	// 		const sizeAttribute = foundSizeAttributes[0];
	// 		sizeKey = sizeAttribute[0];
	// 		sizeValues = sizeAttribute[1];
	// 	}
	//
	// 	const total = colorValues.length + sizeValues.length;
	// 	const array1Size = Math.floor((colorValues.length / total) * 100);
	// 	const array2Size = Math.floor((sizeValues.length / total) * 100);
	// 	const style1 = { flexBasis: array1Size + "%" };
	// 	const style2 = { flexBasis: array2Size + "%" };
	//
	// 	return (
	// 		<div className={`flex ${className}`}>
	// 			<ColorAttribute
	// 				className={`flex flex-wrap gap-1`}
	// 				style={style1}
	// 				values={colorValues}
	// 				product={product}
	// 			></ColorAttribute>
	// 			<SizeAttribute
	// 				className={`flex flex-wrap justify-end gap-1`}
	// 				style={style2}
	// 				values={sizeValues}
	// 				attrKey={sizeKey}
	// 			></SizeAttribute>
	// 		</div>
	// 	);
	// }
	//
	// function ColorAttribute({
	// 	values,
	// 	product,
	// 	className,
	// 	style,
	// }: {
	// 	values: string[];
	// 	product: ProductDto;
	// 	className: string;
	// 	style: CSSProperties;
	// }) {
	// 	return (
	// 		<div className={`${className} content-start`} style={style}>
	// 			{values.map((value) => {
	// 				const style = getStyleByColorCode(value);
	// 				return (
	// 					<button
	// 						type="button"
	// 						onClick={() => {
	// 							product.selectedColor = value;
	// 							setChangeProductColorState(`${product.id}-${value}`);
	// 						}}
	// 						key={value}
	// 						className="
	//                     h-6
	//                     w-6 grow-0 border-2
	//                     border-gray-300 hover:border-gray-600
	//                     dark:border-gray-700 hover:dark:border-gray-400
	//                 "
	// 						style={style}
	// 					></button>
	// 				);
	// 			})}
	// 		</div>
	// 	);
	// }
	//
	// function SizeAttribute({
	// 	values,
	// 	attrKey,
	// 	className,
	// 	style,
	// }: {
	// 	values: string[];
	// 	attrKey: string;
	// 	className: string;
	// 	style: CSSProperties;
	// }) {
	// 	const attribute = attributes.find((a) => a.key === attrKey);
	// 	if (!attribute) {
	// 		console.warn("SizeAttribute: attribute not found", attrKey);
	// 		return <div className={className}></div>;
	// 	}
	//
	// 	return (
	// 		<div className={`${className} content-start`} style={style}>
	// 			{values.map((value) => (
	// 				<span key={value} className="h-6 grow-0">
	// 					{attribute.values.find((value_) => value_.key === value)?.title}
	// 				</span>
	// 			))}
	// 		</div>
	// 	);
	// }

	function Item({ item, product }: { item: ProductItemDto; product: ProductDto }) {
		const colors = item.attributes[AttributesEnum.COLOR] || [];
		const [size] =
			item.attributes[AttributesEnum.SIZE] ||
			item.attributes[AttributesEnum.SIZE_SHOES] ||
			[];

		return (
			<div
				onClick={() => {
					product.selectedItem = item.sku;
					console.log("setChangeProductColorState");
				}}
				className="product-item flex gap-0 border-2 border-white hover:border-gray-300 dark:border-black"
			>
				{size && (
					<div className="size-attribute bg-gray-200 uppercase dark:bg-gray-700">
						{size}
					</div>
				)}
				{colors.map((color) => (
					<div
						key={color}
						className="h-6 w-6 border-2 border-gray-300 dark:border-gray-700"
						style={getStyleByColorCode(color)}
					></div>
				))}
			</div>
		);
	}

	function ItemsLine({ product, className }: { product: ProductDto; className: string }) {
		const items = product.items || [];

		return (
			<div className={`flex ${className}`}>
				<div className={`flex flex-wrap gap-1`}>
					{items.map((item) => (
						<Item key={item.sku} item={item} product={product}></Item>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
			{products.map((product) => (
				<div key={product.id} className="m-1 flex flex-col flex-wrap">
					<Link
						href={`/product/${product.publicId}${
							product.selectedItem ? `?item=${product.selectedItem} ` : ""
						}`}
					>
						<SlowLoadingImage
							postfixes={["small", "medium"]}
							product={product}
							colorInFilters={colorInFilters}
							size={400}
						></SlowLoadingImage>
					</Link>
					<div className="flex flex-wrap">
						<h1 className="mt-1 flex-auto text-sm font-medium text-slate-700 dark:text-slate-200">
							{product.title}
						</h1>
						<div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
							{formatPrice(
								moneySmallToBig(
									doExchange(
										CurrencyEnum.UAH,
										currency,
										product.price,
										exchangeState,
									),
								),
								currency,
							)}
						</div>
					</div>
					<ItemsLine className="mt-1" product={product}></ItemsLine>
					{/*<AttributesLine className="mt-1" product={product}></AttributesLine>*/}
				</div>
			))}
		</div>
	);
}
