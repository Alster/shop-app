"use client";

import "./productPage.css";

import { CheckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useEffect, useState } from "react";

import SlowLoadingImage from "@/app/[locale]/catalog/[[...categories]]/SlowLoadingImage";
import Modal from "@/components/modal";
import { Link, usePathname, useRouter } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { AttributesEnum, SIZE_ATTRS } from "@/shop-shared/constants/attributesEnum";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CategoryDto } from "@/shop-shared/dto/category/category.dto";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import { bagStore } from "@/utils/bag/bagItemsStorage";
import { IBagItem } from "@/utils/bag/iBagItem";
import { createLikeItemKey, likeStore, useLikesStore } from "@/utils/likes/likeItemsStorage";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";
import { IProductPageQuery } from "@/utils/products/iFindProductsQuery";

function BreakParagraph() {
	return <div className="my-10"></div>;
}

const drawAttributeTitle = (title: string, highlightMustSelect: boolean, highlightText: string) => {
	return (
		<div className="text-slate-600 dark:text-slate-300">
			{title}
			{highlightMustSelect && <span className="pl-3 text-red-500">{highlightText}</span>}
		</div>
	);
};

function findBySku(sku: string | null | undefined, product: ProductDto): ProductItemDto | null {
	const foundItem = product.items.find((item) => item.sku === sku);
	return foundItem ?? null;
}

function getSelectedItem(itemFromQuery: string | null, product: ProductDto): ProductItemDto | null {
	if (itemFromQuery) {
		const itemToShow = findBySku(itemFromQuery, product);
		if (itemToShow) {
			return itemToShow;
		}
	}

	if (product.selectedItem) {
		const itemToShow = findBySku(product.selectedItem, product);
		if (itemToShow) {
			return itemToShow;
		}
	}

	if (product.items.length > 0) {
		const itemToShow = product.items[0];
		if (itemToShow) {
			return itemToShow;
		}
	}

	return null;
}

function useSelectedItem(itemFromQuery: null | string, product: ProductDto) {
	const [selectedItem, setSelectedItem] = useState<ProductItemDto | null>(
		getSelectedItem(itemFromQuery, product),
	);

	useEffect(() => {
		const newSelectedItem = getSelectedItem(itemFromQuery, product);
		setSelectedItem(newSelectedItem);
	}, [itemFromQuery, product]);

	return [selectedItem] as const;
}

export default function ProductPage({
	product,
	attributes,
	categories,
	pageQuery,
	exchangeState,
	currency,
}: {
	product: ProductDto;
	attributes: AttributeDto[];
	categories: CategoryDto[];
	pageQuery: IProductPageQuery;
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const t = useTranslations("ProductsPage");
	const router = useRouter();
	const pathName = usePathname();
	const likeItems = useLikesStore();

	const [buyButtonClicked, setBuyButtonClicked] = useState(false);
	const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

	const [selectedItem] = useSelectedItem(pageQuery["item"] ?? null, product);
	console.log("ITEM: " + JSON.stringify(pageQuery["item"], null, 2));

	const [imageIndex, setImageIndex] = useState(0);

	useEffect(() => {
		console.log(`selectedItem: ${JSON.stringify(selectedItem, null, 2)}`);
	}, [selectedItem]);

	// function AttributeColor({ className }: { className?: string }) {
	// 	const attribute = attributes.find((attribute_) => attribute_.key === AttributesEnum.COLOR);
	// 	if (!attribute) {
	// 		return;
	// 	}
	//
	// 	const key = attribute.key;
	// 	const values = product.attrs[key] || [];
	//
	// 	const highlightMustSelect = !selectedItem && buyButtonClicked;
	//
	// 	return (
	// 		<div key={key} className={className}>
	// 			{drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectColor"))}
	// 			<div
	// 				className={`mt-2 flex space-x-4 p-2 text-sm ${
	// 					highlightMustSelect && UNSELECTED_ATTR_STYLE
	// 				}`}
	// 			>
	// 				{values.map((value) => {
	// 					const style = getStyleByColorCode(value);
	// 					return (
	// 						<label key={value}>
	// 							<input
	// 								className="peer sr-only"
	// 								name={key}
	// 								type="radio"
	// 								value={value}
	// 								checked={value === selectedItem}
	// 								onChange={onSelectedItemChange}
	// 								// @ts-ignore
	// 								onClick={onItemClick}
	// 							/>
	// 							<div
	// 								className="flex h-9 w-9 cursor-pointer items-center
	//                                             justify-center border-2
	//                                             border-black
	//                                             outline-black
	//                                             peer-checked:border-4 peer-checked:outline
	//                                             peer-checked:outline-4
	//                                             dark:border-white
	//                                             dark:outline-white
	//                                             "
	// 								style={style}
	// 							></div>
	// 						</label>
	// 					);
	// 				})}
	// 			</div>
	// 		</div>
	// 	);
	// }

	// function AttributeSize({ className }: { className?: string }) {
	// 	const attributePair = Object.entries(product.attrs).find(([key, values]) =>
	// 		SIZE_ATTRS.includes(key as AttributesEnum),
	// 	);
	// 	if (!attributePair) {
	// 		return;
	// 	}
	//
	// 	const attributeKey = attributePair[0];
	// 	const attribute = attributes.find((attribute_) => attribute_.key === attributeKey);
	// 	if (!attribute) {
	// 		return;
	// 	}
	//
	// 	const values = product.attrs[attributeKey] || [];
	// 	const highlightMustSelect = !selectedSizeValue && buyButtonClicked;
	//
	// 	return (
	// 		<div key={attributeKey} className={className}>
	// 			{drawAttributeTitle(attribute?.title, highlightMustSelect, t("selectSize"))}
	// 			<div
	// 				className={`mt-2 flex space-x-4 p-2 text-sm ${
	// 					highlightMustSelect && UNSELECTED_ATTR_STYLE
	// 				}`}
	// 			>
	// 				{values.map((value) => {
	// 					return (
	// 						<label key={value}>
	// 							<input
	// 								className="peer sr-only"
	// 								name={attributeKey}
	// 								type="radio"
	// 								value={value}
	// 								onChange={(e) => onSizeChange(attributeKey, e.target.value)}
	// 								disabled={!selectableSizeValues.has(value)}
	// 								checked={value === selectedSizeValue}
	// 							/>
	// 							<div
	// 								onClick={() => sizeSelect(value)}
	// 								className="flex h-9 cursor-pointer items-center justify-center border p-3
	//                                         text-slate-700 peer-checked:bg-slate-900 peer-checked:font-semibold
	//                                         peer-checked:text-white peer-disabled:opacity-30 dark:border-white dark:text-slate-200
	//                                         dark:peer-checked:bg-slate-100
	//                                         dark:peer-checked:text-black
	//                                         "
	// 							>
	// 								{
	// 									attribute?.values.find((value_) => value_.key === value)
	// 										?.title
	// 								}
	// 							</div>
	// 						</label>
	// 					);
	// 				})}
	// 			</div>
	// 		</div>
	// 	);
	// }

	function Characteristics({ className }: { className?: string }) {
		const characteristics = attributes.filter(
			(attribute) =>
				![AttributesEnum.COLOR, ...SIZE_ATTRS].includes(attribute.key as AttributesEnum),
		);
		if (characteristics.length === 0) {
			return;
		}

		return (
			<div className={className}>
				{characteristics.map((attribute) => (
					<div key={attribute.key} className="my-2 flex">
						{drawAttributeTitle(attribute?.title + ":", false, "")}
						<div className="pl-3">
							{(product.attrs[attribute.key] || []).map((value) => {
								return (
									<div key={value}>
										{
											attribute?.values.find((value_) => value_.key === value)
												?.title
										}
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>
		);
	}

	function ItemsList({
		product,
		className,
		selectedItem,
	}: {
		product: ProductDto;
		selectedItem: ProductItemDto | null;
		className: string;
	}) {
		const items = product.items || [];

		return (
			<>
				<div>{drawAttributeTitle(`${t("availableVariantsToBuy")}:`, false, "")}</div>
				<div className={`${className}`}>
					{items.map((item) => (
						<div key={item.sku} className="my-2 flex">
							<Item
								item={item}
								product={product}
								isSelected={selectedItem?.sku === item.sku}
							></Item>
						</div>
					))}
				</div>
			</>
		);
	}

	function Item({
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
			item.attributes[AttributesEnum.SIZE] ||
			item.attributes[AttributesEnum.SIZE_SHOES] ||
			[];

		return (
			<Link
				replace={true}
				href={`/product/${product.publicId}?item=${item.sku}`}
				className={`product-item flex gap-0 border-2 ${
					isSelected
						? "border-gray-400 dark:border-gray-400"
						: "border-white dark:border-black"
				} hover:border-gray-300 hover:dark:border-gray-500`}
			>
				{size && (
					<div
						className="flex h-9 items-center justify-center bg-gray-200 p-3 font-semibold
						uppercase dark:bg-gray-700"
					>
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

	const addToBag = () => {
		const attribute = attributes.find((attribute_) =>
			SIZE_ATTRS.includes(attribute_.key as AttributesEnum),
		);
		if (!attribute) {
			throw new Error("No size attribute found");
		}

		if (!product.id) {
			throw new Error("No product id");
		}

		if (!selectedItem) {
			throw new Error("No selected item");
		}

		const bagItem: IBagItem = {
			productId: product.id,
			publicId: product.publicId,
			title: product.title,
			price: product.price,
			item: selectedItem,
		};

		bagStore.addToStore(bagItem);

		console.log(`Added to bag: ${JSON.stringify(bagItem, null, 2)}`);
	};

	const buyNow = () => {
		addToBag();
	};

	return (
		<div className="flex items-center justify-center">
			{isAddProductModalOpen && (
				<Modal>
					<div className="relative flex items-center justify-between">
						<h3 className="text-xl font-medium">{t("productAddedToBag")}</h3>
						<button
							type="button"
							className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
							onClick={() => setIsAddProductModalOpen(false)}
						>
							<svg
								aria-hidden="true"
								className="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
					</div>
					<div className="m-8 flex justify-center">
						<div className="rounded-full bg-gray-100">
							<CheckIcon className="m-4 h-16 w-16 text-green-400" />
						</div>
					</div>
					<Link
						href="/bag"
						className="
                                     flex h-12 items-center justify-center border border-slate-200
                                     bg-slate-800 font-medium
                                     uppercase
                                     tracking-wider text-white
                                     dark:bg-slate-200 dark:text-black
                                 "
					>
						{t("goToBag")}
					</Link>
					<button
						onClick={() => setIsAddProductModalOpen(false)}
						className="flex h-12 w-full items-center
                                    justify-center border border-slate-800 font-medium uppercase
                                    tracking-wider text-black
                                    dark:border-slate-200 dark:text-white
                                "
						type="button"
					>
						{t("continueShopping")}
					</button>
				</Modal>
			)}

			<div className="products-page grid grid-cols-1 lg:grid-cols-2">
				<div>
					<SlowLoadingImage
						postfixes={["small", "big"]}
						product={product}
						itemToShow={selectedItem}
						indexToShow={imageIndex}
						size={1000}
					></SlowLoadingImage>
					{selectedItem && (
						<div className="grid grid-cols-3 pt-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5">
							{selectedItem.images.map((imageUrl, index) => (
								<div
									className={`m-1 cursor-pointer border-4 ${
										index === imageIndex
											? "border-black dark:border-white"
											: "border-white dark:border-black"
									} hover:border-black dark:hover:border-white`}
									onClick={() => setImageIndex(index)}
								>
									<SlowLoadingImage
										key={index}
										postfixes={["small", "medium"]}
										product={product}
										itemToShow={selectedItem}
										indexToShow={index}
										size={256}
									></SlowLoadingImage>
								</div>
							))}
						</div>
					)}
				</div>
				<div className="p-3">
					<div className="flex"></div>
					<h1 className="mt-1 flex-auto text-lg font-medium text-slate-700 dark:text-slate-200">
						{product.title}
					</h1>
					<div className="mt-3 text-2xl font-semibold text-slate-800 dark:text-slate-100">
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
					<BreakParagraph></BreakParagraph>
					<div>
						{/*<AttributeColor className="mt-4"></AttributeColor>*/}
						{/*<AttributeSize className="mt-4"></AttributeSize>*/}
						<Characteristics className="mt-10"></Characteristics>
						<BreakParagraph></BreakParagraph>
						<ItemsList
							className="mt-1"
							product={product}
							selectedItem={selectedItem}
						></ItemsList>
					</div>
					<BreakParagraph></BreakParagraph>
					<div className="mb-5 flex space-x-4 text-sm font-medium">
						<button
							onClick={() => {
								setBuyButtonClicked(true);

								if (!selectedItem) {
									return;
								}

								buyNow();
								setIsAddProductModalOpen(true);
							}}
							className="
                                flex h-12 w-1/2 flex-auto justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
						>
							<span className="mt-2">
								<ShoppingBagIcon className="h-8 w-8" />
							</span>
							<span className="ml-2 mt-4">
								{t("bAdd")}
								<span className="ml-2">
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
								</span>
							</span>
						</button>
						<button
							onClick={() => {
								if (!selectedItem) {
									throw new Error("No selected item");
								}
								likeStore.addToStore({
									productId: product.id,
									publicId: product.publicId,
									title: product.title,
									price: product.price,
									item: selectedItem,
								});
							}}
							className="
                            border-slate-200\ flex h-12 w-12 flex-none items-center justify-center border text-slate-300
                        "
							type="button"
							aria-label="Like"
						>
							<HeartIcon
								className={`h-8 w-8 ${
									selectedItem &&
									likeItems.hasOwnProperty(
										createLikeItemKey({
											productId: product.id,
											item: selectedItem,
										}),
									)
										? "text-red-500"
										: "text-gray-400"
								}`}
							></HeartIcon>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
