import Image from "next/image";
import { useTranslations } from "next-intl";
import * as React from "react";
import { ReactElement } from "react";

import getImageUrl from "@/app/[locale]/catalog/[[...categories]]/getImageUrl";
import { Link } from "@/navigation";
import { doExchange } from "@/shop-exchange-shared/doExchange";
import { formatPrice } from "@/shop-exchange-shared/formatPrice";
import { ExchangeState } from "@/shop-exchange-shared/helpers";
import { AttributesEnum, SIZE_ATTRS } from "@/shop-shared/constants/attributesEnum";
import { CurrencyEnum } from "@/shop-shared/constants/exchange";
import { moneySmallToBig } from "@/shop-shared/dto/primitiveTypes";
import { IBagItem } from "@/utils/bag/iBagItem";
import { IProductShortDto } from "@/utils/iProductShort.dto";
import { getStyleByColorCode } from "@/utils/products/getStyleByColorCode";

export default function ProductItem({
	shortProduct,
	cornerBlock,
	currency,
	exchangeState,
}: {
	shortProduct: IProductShortDto;
	cornerBlock?: ReactElement;
	currency: CurrencyEnum;
	exchangeState: ExchangeState;
}) {
	const t = useTranslations("ProductItem");
	const productHref =
		`/product/${shortProduct.publicId}` +
		(shortProduct.item.sku && `?item=${shortProduct.item.sku}`);

	const drawSize = (bagItem: IBagItem) => {
		const sizeAttribute = Object.entries(bagItem.item.attributes).find(([key]) =>
			[...SIZE_ATTRS.values()].includes(key as AttributesEnum),
		);

		if (!sizeAttribute) {
			return;
		}

		return sizeAttribute[1].map((v) => v.toUpperCase()).join(", ");
	};

	const colors = shortProduct.item.attributes[AttributesEnum.COLOR];
	const image = getImageUrl(shortProduct.item, "medium", 0);

	return (
		<div className="m-3 flex p-1">
			<Link href={productHref}>
				<Image
					className="rounded-2xl"
					src={image}
					alt={shortProduct.title}
					width={200}
					height={200}
					loading="lazy"
				/>
			</Link>
			<div className="flex w-full flex-col flex-wrap pl-4">
				<div className="flex flex-auto flex-wrap">
					<div className="flex-auto">
						<Link className="text-lg font-semibold" href={productHref}>
							{shortProduct.title}
						</Link>
					</div>
					<div>{cornerBlock}</div>
				</div>
				<div className="flex flex-wrap">
					<div className="flex-auto">
						<div className="text-md flex text-slate-500">
							<div className="w-20 text-sm">{t("color")}:</div>
							{colors.map((color) => (
								<div
									key={color}
									style={getStyleByColorCode(color)}
									className="h-6 w-6 border-2 border-gray-300 dark:border-gray-700"
								></div>
							))}
						</div>
						{SIZE_ATTRS.some(
							(sizeAttribute) => shortProduct.item.attributes[sizeAttribute],
						) && (
							<div className="flex">
								<span className="w-20 text-sm text-slate-500">{t("size")}</span>
								<span className="pl-2 font-bold">{drawSize(shortProduct)}</span>
							</div>
						)}
					</div>
					<div className="flex flex-col flex-wrap text-lg font-bold">
						<div className="flex-auto"></div>
						<div className="flex">
							{formatPrice(
								moneySmallToBig(
									doExchange(
										CurrencyEnum.UAH,
										currency,
										shortProduct.price,
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
