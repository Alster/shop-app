"use client";

import "./likesView.css";

import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import * as React from "react";
import { Fragment, ReactElement } from "react";

import HorizontalLine from "@/components/horizontalLine";
import ProductItem from "@/components/productItem";
import StatusInfo from "@/components/statusInfo";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { likeStore, useLikesStore } from "@/utils/likes/likeItemsStorage";

export default function LikesView({
	exchangeState,
	currency,
}: {
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const t = useTranslations("LikesPage");
	const likeItems = useLikesStore();

	if (Object.keys(likeItems).length === 0) {
		return (
			<Fragment>
				{/*<div className="actionButtons svelte-1vnfr1y">*/}
				{/*	<button className="!xl:px-5 magicButton w-[409px] rounded-xl px-10 py-2 text-base">*/}
				{/*		Join for FREE*/}
				{/*	</button>*/}
				{/*</div>*/}
				{/*<button*/}
				{/*	aria-describedby="tier-hobby"*/}
				{/*	className="magicButton mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:mt-10"*/}
				{/*>*/}
				{/*	JOIN FOR FREE*/}
				{/*</button>*/}
				<StatusInfo
					iconConfig={{
						icon: <HeartIcon></HeartIcon>,
						textColor: "text-white-400",
						backgroundColor: "bg-gray-400",
					}}
					title={t("emptyLikesList")}
					description={t("emptyLikesListDescription")}
				></StatusInfo>
				;
			</Fragment>
		);
	}

	return (
		<div className="flex flex-col lg:flex-row">
			<div className="flex-auto lg:px-8">
				{Object.entries(likeItems)
					.map(([key, likeItem]) => (
						<ProductItem
							key={key}
							shortProduct={likeItem}
							currency={currency}
							exchangeState={exchangeState}
							cornerBlock={
								<button
									className=""
									onClick={() => {
										likeStore.removeFromStore(key);
									}}
								>
									<TrashIcon className="h-6 w-6 text-gray-500" />
								</button>
							}
						></ProductItem>
					))
					.reduce((previous, element) => {
						if (previous.length > 0) {
							previous.push(<HorizontalLine key={Math.random()}></HorizontalLine>);
						}
						previous.push(element);
						return previous;
					}, [] as ReactElement[])}
			</div>
			<div className="m-2 bg-gray-100 p-2 lg:w-1/3 dark:bg-gray-900">
				<HorizontalLine></HorizontalLine>
				<button
					onClick={() => {
						likeStore.clearStore();
					}}
					className="
                                flex h-12 w-full justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
				>
					<span className="ml-2 mt-3">{`${t("bClearLikes")}`}</span>
				</button>
			</div>
		</div>
	);
}
