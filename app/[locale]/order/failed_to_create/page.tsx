import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import * as React from "react";

import StatusInfo from "@/components/statusInfo";

export default function FailedToCreateOrderPage({ searchParams }: any) {
	const t = useTranslations("FailedToCreateOrderPage");
	return (
		<div className="flex flex-col items-center justify-centent">
			<div className="flex flex-col text-center">
				<StatusInfo
					iconConfig={{
						icon: <XMarkIcon></XMarkIcon>,
						textColor: "text-white-400",
						backgroundColor: "bg-red-400",
					}}
					title={t("failedToCreateOrder")}
					description={t("failedToCreateOrderDescription")}
					extraInfo={
						<div className="text-red-400 font-semibold">{searchParams.reason}</div>
					}
				></StatusInfo>

				<Link
					href="/bag"
					className="
                    flex justify-center w-full h-12 uppercase font-medium tracking-wider
                     dark:bg-slate-200 dark:text-black
                     bg-slate-800 text-white
                 "
				>
					<span className="mt-3 ml-2">{`${t("bGoToBag")}`}</span>
				</Link>
			</div>
		</div>
	);
}
