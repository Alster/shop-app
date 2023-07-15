import Image from "next/image";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import * as React from "react";
import { ReactElement } from "react";

import { AttributesEnum, SIZE_ATTRS } from "@/app/constants";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { IBagItem } from "@/utils/bag/iBagItem";
import { IProductShortDto } from "@/utils/iProductShort.dto";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";

export default function ProductItem({
	item,
	cornerBlock,
	currency,
	exchangeState,
}: {
	item: IProductShortDto;
	cornerBlock?: ReactElement;
	currency: CurrencyEnum;
	exchangeState: ExchangeState;
}) {
	const t = useTranslations("ProductItem");
	let productHref = `/product/${item.publicId}`;

	if (item.attributes[AttributesEnum.COLOR]) {
		productHref += `?color=${item.attributes[AttributesEnum.COLOR][0]}`;
	}

	const drawSize = (bagItem: IBagItem) => {
		const sizeAttribute = Object.entries(bagItem.attributes).find(([key]) =>
			[...SIZE_ATTRS.values()].includes(key as AttributesEnum),
		);

		if (!sizeAttribute) {
			return;
		}

		return sizeAttribute[1].map((v) => v.toUpperCase()).join(", ");
	};

	const style = getStyleByColorCode(item.attributes[AttributesEnum.COLOR][0]);

	return (
		<div className="p-1 m-3 flex">
			<Link href={productHref}>
				<Image
					className="rounded-2xl"
					src="https://picsum.photos/200/200"
					alt={item.title}
					width={200}
					height={200}
					loading="lazy"
				/>
			</Link>
			<div className="pl-4 w-full flex flex-wrap flex-col">
				<div className="flex-auto flex flex-wrap">
					<div className="flex-auto">
						<Link className="font-semibold text-lg" href={productHref}>
							{item.title}
						</Link>
					</div>
					<div>{cornerBlock}</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex-auto">
						{item.attributes[AttributesEnum.COLOR] && (
							<div className="text-md flex text-slate-500">
								<div className="w-20 text-sm">{t("color")}:</div>
								<div
									style={style}
									className="ml-2 w-6 h-6 border-2 border-gray-300 dark:border-gray-700"
								></div>
							</div>
						)}
						{SIZE_ATTRS.some((sizeAttribute) => item.attributes[sizeAttribute]) && (
							<div className="flex">
								<span className="w-20 text-slate-500 text-sm">{t("size")}</span>
								<span className="font-bold pl-2">{drawSize(item)}</span>
							</div>
						)}
					</div>
					<div className="font-bold text-lg flex flex-wrap flex-col">
						<div className="flex-auto"></div>
						<div className="flex">
							{formatPrice(
								moneySmallToBig(
									doExchange(
										CurrencyEnum.UAH,
										currency,
										item.price,
										exchangeState,
									),
								),
								currency,
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
