"use client";

import "./productPage.css";

import assert from "node:assert";

import { CheckIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/solid";
import { useTranslations } from "next-intl";
import * as React from "react";
import { useCallback, useState } from "react";

import SlowLoadingImage from "@/app/[locale]/catalog/[[...categories]]/SlowLoadingImage";
import Modal from "@/components/modal";
import Characteristics from "@/components/productPage/characteristics";
import ItemsList from "@/components/productPage/itemsList";
import { Link } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { SIZE_ATTRS } from "@/shop-shared/constants/attributesEnum";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";
import arrayContains from "@/shop-shared/utils/arrayContains";
import { bagStore } from "@/utils/bag/bagItemsStorage";
import { IBagItem } from "@/utils/bag/iBagItem";
import { createLikeItemKey, likeStore, useLikesStore } from "@/utils/likes/likeItemsStorage";
import { IProductPageQuery } from "@/utils/products/iFindProductsQuery";

function BreakParagraph() {
	return <div className="my-10"></div>;
}

export default function ProductPage({
	product,
	attributes,
	pageQuery,
	exchangeState,
	currency,
}: {
	product: ProductDto;
	attributes: AttributeDto[];
	pageQuery: IProductPageQuery;
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const t = useTranslations("ProductsPage");
	const likeItems = useLikesStore();

	const selectedItem = getSelectedItem(pageQuery["item"] ?? null, product);

	const [imageIndex, setImageIndex] = useState(0);

	const [buyButtonClicked, setBuyButtonClicked] = useState(false);
	const highlightMustSelect = !selectedItem && buyButtonClicked;

	const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

	const addToBag = useCallback(() => {
		const attribute = attributes.find((attribute_) =>
			arrayContains(SIZE_ATTRS, attribute_.key),
		);
		assert.ok(attribute, new Error("No size attribute found"));
		assert.ok(product.id, new Error("No product id"));
		assert.ok(selectedItem, new Error("No selected item"));

		const bagItem = {
			productId: product.id,
			publicId: product.publicId,
			title: product.title,
			price: product.price,
			item: selectedItem,
		} as const satisfies IBagItem;

		bagStore.addToStore(bagItem);

		console.log(`Added to bag: ${JSON.stringify(bagItem, null, 2)}`);
	}, [attributes, product, selectedItem]);

	const buyNow = useCallback(() => {
		addToBag();
	}, [addToBag]);

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
						<Characteristics
							className="mt-10"
							product={product}
							attributes={attributes}
						></Characteristics>
						<BreakParagraph></BreakParagraph>
						<ItemsList
							className="mt-1"
							product={product}
							selectedItem={selectedItem}
							highlightMustSelect={highlightMustSelect}
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

function findBySku(sku: string | null | undefined, product: ProductDto): ProductItemDto | null {
	const foundItem = product.items.find((item) => item.sku === sku);
	return foundItem ?? null;
}
