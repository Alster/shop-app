"use client";

import { ShoppingBagIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import * as React from "react";
import { ReactElement } from "react";

import HorizontalLine from "@/components/horizontalLine";
import ProductItem from "@/components/productItem";
import StatusInfo from "@/components/statusInfo";
import { Link } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { bagStore, useBagStore } from "@/utils/bag/bagItemsStorage";

const sum = (array: number[]) => array.reduce((a, b) => a + b, 0);

export default function BagView({
	exchangeState,
	currency,
}: {
	exchangeState: ExchangeState;
	currency: CurrencyEnum;
}) {
	const t = useTranslations("BagPage");
	const bagItems = useBagStore();

	if (Object.keys(bagItems).length === 0) {
		return (
			<StatusInfo
				iconConfig={{
					icon: <ShoppingBagIcon></ShoppingBagIcon>,
					textColor: "text-white-400",
					backgroundColor: "bg-gray-400",
				}}
				title={t("emptyBag")}
				description={t("emptyBagDescription")}
			></StatusInfo>
		);
	}

	return (
		<div className="flex flex-col lg:flex-row">
			<div className="flex-auto lg:px-8">
				{Object.entries(bagItems)
					.map(([key, bagItem]) => (
						<ProductItem
							key={key}
							item={bagItem}
							currency={currency}
							exchangeState={exchangeState}
							cornerBlock={
								<button
									className=""
									onClick={() => {
										bagStore.removeFromStore(key);
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
			<div className="m-2 bg-gray-100 p-2 dark:bg-gray-900 lg:w-1/3">
				<div className="flex text-lg">
					<div className="flex-auto">{t("totalPrice")}:</div>
					<div className="font-bold">
						{formatPrice(
							moneySmallToBig(
								doExchange(
									CurrencyEnum.UAH,
									currency,
									sum(
										Object.values(bagItems).map((item) => item.price as number),
									),
									exchangeState,
								),
							),
							currency,
						)}
					</div>
				</div>
				<HorizontalLine></HorizontalLine>
				<Link
					href="/checkout"
					className="
                                flex h-12 w-full justify-center bg-slate-800 font-medium uppercase
                                 tracking-wider text-white
                                 dark:bg-slate-200 dark:text-black
                             "
				>
					<span className="ml-2 mt-3">{`${t("bCheckout")}`}</span>
				</Link>
			</div>
		</div>
	);
}
