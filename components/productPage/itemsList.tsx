import { useTranslations } from "next-intl";
import * as React from "react";

import AttributeTitle from "@/components/productPage/attributeTitle";
import Item from "@/components/productPage/item";
import { ProductDto, ProductItemDto } from "@/shop-shared/dto/product/product.dto";

const UNSELECTED_ATTR_STYLE = "outline outline-2 outline-red-500";

export default function ItemsList({
	product,
	className,
	selectedItem,
	highlightMustSelect,
}: {
	product: ProductDto;
	selectedItem: ProductItemDto | null;
	className: string;
	highlightMustSelect: boolean;
}) {
	const t = useTranslations("ProductsPage");
	const items = product.items || [];

	return (
		<>
			<div>
				<AttributeTitle
					title={`${t("availableVariantsToBuy")}:`}
					highlightMustSelect={highlightMustSelect}
					highlightText={t("selectItem")}
				></AttributeTitle>
			</div>
			<div className={`${className} ${highlightMustSelect && UNSELECTED_ATTR_STYLE}`}>
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
