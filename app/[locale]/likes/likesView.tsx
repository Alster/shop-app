"use client";

import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import * as React from "react";
import { ReactElement } from "react";

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
			<StatusInfo
				iconConfig={{
					icon: <HeartIcon></HeartIcon>,
					textColor: "text-white-400",
					backgroundColor: "bg-gray-400",
				}}
				title={t("emptyLikesList")}
				description={t("emptyLikesListDescription")}
			></StatusInfo>
		);
	}

	return (
		<div className="flex flex-col lg:flex-row">
			<div className="flex-auto lg:px-8">
				{Object.entries(likeItems)
					.map(([key, likeItem]) => (
						<ProductItem
							key={key}
							item={likeItem}
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
			<div className="m-2 p-2 bg-gray-100 dark:bg-gray-900 lg:w-1/3">
				<HorizontalLine></HorizontalLine>
				<button
					onClick={() => {
						likeStore.clearStore();
					}}
					className="
                                flex justify-center w-full h-12 uppercase font-medium tracking-wider
                                 dark:bg-slate-200 dark:text-black
                                 bg-slate-800 text-white
                             "
				>
					<span className="mt-3 ml-2">{`${t("bClearLikes")}`}</span>
				</button>
			</div>
		</div>
	);
}
