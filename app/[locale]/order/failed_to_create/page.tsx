import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import * as React from "react";

import StatusInfo from "@/components/statusInfo";
import { Link } from "@/i18n/routing";

export default function FailedToCreateOrderPage({
	searchParams,
	params,
}: {
	searchParams: Promise<{ reason: string }>;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = React.use(params);
	const { reason } = React.use(searchParams);
	setRequestLocale(locale);
	const t = useTranslations("FailedToCreateOrderPage");

	return (
		<div className="justify-centent flex flex-col items-center">
			<div className="flex flex-col text-center">
				<StatusInfo
					iconConfig={{
						icon: <XMarkIcon></XMarkIcon>,
						textColor: "text-white-400",
						backgroundColor: "bg-red-400",
					}}
					title={t("failedToCreateOrder")}
					description={t("failedToCreateOrderDescription")}
					extraInfo={<div className="font-semibold text-red-400">{reason}</div>}
				></StatusInfo>

				<Link
					href="/bag"
					className="
                    flex h-12 w-full justify-center bg-slate-800 font-medium uppercase
                     tracking-wider text-white
                     dark:bg-slate-200 dark:text-black
                 "
				>
					<span className="ml-2 mt-3">{`${t("bGoToBag")}`}</span>
				</Link>
			</div>
		</div>
	);
}
