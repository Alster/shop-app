"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import * as qs from "qs";
import * as React from "react";
import { Fragment, useEffect, useReducer, useState } from "react";

import CategoryTreeView from "@/components/categoryTreeView";
import AttributeFilter from "@/components/filters/attributeFilter";
import StatusInfo from "@/components/statusInfo";
import TextSearchDesktop from "@/components/textSearchDesktop";
import TextSearchMobile from "@/components/textSearchMobile";
import { Link, usePathname, useRouter } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { AttributesEnum, SIZE_ATTRS } from "@/shop-shared/constants/attributesEnum";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { CategoriesNodeDto } from "@/shop-shared/dto/category/categories-tree.dto";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { AttributeDto } from "@/shop-shared/dto/product/attribute.dto";
import { ProductDto } from "@/shop-shared/dto/product/product.dto";
import { ProductListResponseDto } from "@/shop-shared/dto/product/product-list.response.dto";
import { fetchProducts } from "@/utils/fetchProducts";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";
import useMobileViewScreen from "@/utils/seearch/useMobileViewScreen";

export default function ProductsList({
	productsResponseEncoded,
	attributes,
	categories,
	selectedCategories,
	exchangeState,
	currency,
	pageQueryEncoded,
}: {
	productsResponseEncoded: string;
	attributes: AttributeDto[];
	categories: CategoriesNodeDto[];
	selectedCategories: string[];
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
	pageQueryEncoded: string;
}) {
	const t = useTranslations("ProductsList");
	const locale = useLocale();

	const router = useRouter();
	const pathName = usePathname();
	const searchParameters = useSearchParams();

	const [productsResponse, setProductsResponse] = useState<ProductListResponseDto>(
		JSON.parse(productsResponseEncoded),
	);
	const [pageQuery, setPageQuery] = useState<IFindProductsQuery>(JSON.parse(pageQueryEncoded));

	const [searchTerm, setSearchTerm] = useMobileViewScreen(pageQuery.search || "");
	useEffect(() => {
		if (searchTerm !== pageQuery.search) {
			const newPageQuery = { ...pageQuery };
			if (searchTerm === "") {
				delete newPageQuery.search;
				pushQuery({ ...newPageQuery });
			} else {
				pushQuery({ ...newPageQuery, search: searchTerm });
			}
		}
	}, [searchTerm]);

	const [showMobileFilters, toggleShowMobileFilters] = useReducer(
		(state: boolean) => !state,
		false,
	);

	console.log("ProductsList searchParams", qs.parse(searchParameters.toString()));

	console.log(`attributes`, attributes);
	console.log(`categories`, categories);

	useEffect(() => {
		console.log("locale changed", locale, "pathName", pathName);
	}, [locale]);

	const pushQuery = (pageQuery: unknown) => {
		console.log("updateQuery", pageQuery);
		const newPath = `${pathName}?${qs.stringify(pageQuery)}`;
		console.log("newPath", newPath);
		router.push(newPath);
	};

	const updateProducts = async (pq: IFindProductsQuery) => {
		if (selectedCategories.length > 0) {
			pq.categories = [selectedCategories.join("/")];
		}
		console.log("updateProducts", pq);
		const res = await fetchProducts(locale, pq);
		delete pq.categories;
		setProductsResponse(res);
	};

	useEffect(() => {
		console.log("searchParams triggered", searchParameters);
		const parameters = qs.parse(searchParameters.toString()) as any;
		setPageQuery(parameters);
		updateProducts(parameters);
	}, [searchParameters]);

	const getAttributesFromQuery = (pq: IFindProductsQuery) => {
		const attributes_: Record<string, string[]> = {};
		for (const attribute of pq.attrs || []) {
			attributes_[attribute.key] = [...attribute.values];
		}
		return attributes_;
	};

	const storeAttributesToQuery = (attributes_: Record<string, string[]>) => {
		return {
			...(qs.parse(searchParameters.toString()) as any),
			attrs: Object.entries(attributes_).map(([key, values]) => ({ key, values })),
		};
	};

	const addFilterValue = (key: string, value: string) => {
		const attributes_ = getAttributesFromQuery(qs.parse(searchParameters.toString()) as any);

		attributes_[key] = attributes_[key] ? [...new Set([...attributes_[key], value])] : [value];

		const newQuery = storeAttributesToQuery(attributes_);
		pushQuery(newQuery);
	};

	const removeFilterValue = (key: string, value: string) => {
		const attributes_ = getAttributesFromQuery(qs.parse(searchParameters.toString()) as any);

		if (attributes_[key]) {
			attributes_[key] = attributes_[key].filter((v: string) => v !== value);
			if (attributes_[key].length === 0) {
				delete attributes_[key];
			}
		}

		const newQuery = storeAttributesToQuery(attributes_);
		pushQuery(newQuery);
	};

	const toggleFilterValue = (key: string, value: string) => {
		const attributes_ = getAttributesFromQuery(qs.parse(searchParameters.toString()) as any);

		if (attributes_[key]) {
			if (attributes_[key].includes(value)) {
				attributes_[key] = attributes_[key].filter((v: string) => v !== value);
				if (attributes_[key].length === 0) {
					delete attributes_[key];
				}
			} else {
				attributes_[key] = [...new Set([...attributes_[key], value])];
			}
		} else {
			attributes_[key] = [value];
		}

		const newQuery = storeAttributesToQuery(attributes_);
		pushQuery(newQuery);
	};

	function AttributesLine({ product, className }: { product: ProductDto; className: string }) {
		const colorValues = product.attrs[AttributesEnum.COLOR] || [];

		let sizeKey = "";
		let sizeValues: string[] = [];
		const foundSizeAttributes = Object.entries(product.attrs).filter(([key, value]) =>
			SIZE_ATTRS.includes(key as AttributesEnum),
		);
		if (foundSizeAttributes.length > 0) {
			const sizeAttribute = foundSizeAttributes[0];
			sizeKey = sizeAttribute[0];
			sizeValues = sizeAttribute[1];
		}

		const total = colorValues.length + sizeValues.length;
		const array1Size = Math.floor((colorValues.length / total) * 100);
		const array2Size = Math.floor((sizeValues.length / total) * 100);
		const style1 = { flexBasis: array1Size + "%" };
		const style2 = { flexBasis: array2Size + "%" };

		return (
			<div className={`flex ${className}`}>
				<ColorAttribute
					className={`flex flex-wrap gap-1`}
					style={style1}
					values={colorValues}
					product={product}
				></ColorAttribute>
				<SizeAttribute
					className={`flex flex-wrap justify-end gap-1`}
					style={style2}
					values={sizeValues}
					attrKey={sizeKey}
				></SizeAttribute>
			</div>
		);
	}

	function ColorAttribute({
		values,
		product,
		className,
		style,
	}: {
		values: string[];
		product: ProductDto;
		className: string;
		style: any;
	}) {
		return (
			<div className={`${className} content-start`} style={style}>
				{values.map((value) => {
					const style = getStyleByColorCode(value);
					return (
						<Link
							href={`/product/${product.publicId}?${AttributesEnum.COLOR}=${value}`}
							key={value}
							className="
                        h-6
                        w-6 grow-0 border-2
                        border-gray-300 hover:border-gray-600
                        dark:border-gray-700 hover:dark:border-gray-400
                    "
							style={style}
						></Link>
					);
				})}
			</div>
		);
	}

	function SizeAttribute({
		values,
		attrKey,
		className,
		style,
	}: {
		values: string[];
		attrKey: string;
		className: string;
		style: any;
	}) {
		const attribute = attributes.find((a) => a.key === attrKey);
		if (!attribute) {
			console.log("SizeAttribute: attribute not found", attrKey);
			return <div className={className}></div>;
		}

		return (
			<div className={`${className} content-start`} style={style}>
				{values.map((value) => (
					<span key={value} className="h-6 grow-0">
						{attribute.values.find((value_) => value_.key === value)?.title}
					</span>
				))}
			</div>
		);
	}

	function FiltersDesktop({ className }: { className?: string }) {
		return (
			<div className={`${className} flex flex-wrap items-center`}>
				<TextSearchDesktop className="hidden lg:flex"></TextSearchDesktop>
				{Object.entries(productsResponse.filters).map(([key, values]) => (
					<AttributeFilter
						key={key}
						values={values}
						selected={
							pageQuery.attrs?.find((attribute: any) => attribute.key === key)
								?.values || []
						}
						attributeInfo={attributes.find((a) => a.key === key)}
						onToggle={(value: string) => toggleFilterValue(key, value)}
					></AttributeFilter>
				))}
			</div>
		);
	}

	function FiltersButtonMobile({
		className,
		toggle,
	}: {
		className?: string;
		toggle: () => void;
	}) {
		return (
			<Fragment>
				<div className={`${className} flex flex-wrap`}>
					<button
						onClick={() => toggle()}
						className="
                                flex h-12 w-full items-center justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
					>
						<div className="flex items-center">
							<AdjustmentsHorizontalIcon className="inline-block h-10 w-10"></AdjustmentsHorizontalIcon>
							<div>Filters</div>
						</div>
					</button>
				</div>
			</Fragment>
		);
	}

	const drawCategories = () => {
		return (
			<div className="flex">
				<CategoryTreeView
					tree={categories}
					selectedCategories={selectedCategories}
				></CategoryTreeView>
			</div>
		);
	};

	return (
		<Fragment>
			{showMobileFilters && (
				<div className="fixed top-0 h-full w-full">
					<div className="flex h-full w-full flex-col bg-white dark:bg-slate-800">
						{Object.entries(productsResponse.filters).map(([key, values]) => (
							<AttributeFilter
								key={key}
								values={values}
								selected={
									pageQuery.attrs?.find((attribute: any) => attribute.key === key)
										?.values || []
								}
								attributeInfo={attributes.find((a) => a.key === key)}
								onToggle={(value: string) => toggleFilterValue(key, value)}
							></AttributeFilter>
						))}
					</div>
				</div>
			)}
			{!showMobileFilters && (
				<Fragment>
					<TextSearchMobile className="flex lg:hidden"></TextSearchMobile>
					<FiltersButtonMobile
						toggle={toggleShowMobileFilters}
						className="flex lg:hidden"
					></FiltersButtonMobile>
					<div className="flex">
						{/*{searchParams.toString()}*/}
						{drawCategories()}
						<div>
							<FiltersDesktop className="hidden lg:flex"></FiltersDesktop>
							{productsResponse.products.length === 0 && (
								<StatusInfo
									iconConfig={{
										icon: <MagnifyingGlassIcon></MagnifyingGlassIcon>,
										textColor: "text-white-400",
										backgroundColor: "bg-gray-400",
									}}
									title={t("emptyProductsList")}
									description={t("emptyProductsListDescription")}
								></StatusInfo>
							)}
							<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
								{productsResponse.products.map((product) => (
									<div key={product.id} className="m-1 flex flex-col flex-wrap">
										<Link href={`/product/${product.publicId}`}>
											<Image
												src="https://picsum.photos/200/200"
												alt={product.title}
												width={400}
												height={400}
												loading="lazy"
											/>
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
										<AttributesLine
											className="mt-1"
											product={product}
										></AttributesLine>
									</div>
								))}
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
}
