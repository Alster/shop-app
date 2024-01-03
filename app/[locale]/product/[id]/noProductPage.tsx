import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import * as React from "react";

import StatusInfo from "@/components/statusInfo";

export default function NoProductPage() {
	const t = useTranslations("ProductsPage");

	return (
		<StatusInfo
			iconConfig={{
				icon: <ShoppingBagIcon></ShoppingBagIcon>,
				textColor: "text-white-400",
				backgroundColor: "bg-gray-400",
			}}
			title={t("productNotAvailable")}
			description={t("productNotAvailableDescription")}
		></StatusInfo>
	);
}
