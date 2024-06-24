import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as qs from "qs";
import { useState } from "react";

import { usePathname, useRouter } from "@/navigation";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

export default function TextSearchDesktop({ className }: { className?: string }) {
	const t = useTranslations("ProductsList");
	const pathname = usePathname();
	const searchParameters = useSearchParams();
	const router = useRouter();

	const pageQuery = qs.parse(searchParameters.toString()) as IFindProductsQuery;
	const [currentValue, setCurrentValue] = useState<string>(pageQuery.search || "");

	const newQuery = { ...pageQuery };
	if (currentValue.length > 0) {
		newQuery.search = currentValue;
	} else {
		delete newQuery.search;
	}
	const newParameters = qs.stringify(newQuery);
	const targetHref = `${pathname}?${newParameters}`;

	const onSubmit = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		router.push(targetHref);
	};

	return (
		<form
			onSubmit={onSubmit}
			className={`${className} flex border-b-2 border-black dark:border-white`}
		>
			<div className="ml-2 flex items-center">
				<MagnifyingGlassIcon className="mr-2 h-6 w-6"></MagnifyingGlassIcon>
			</div>
			<input
				type="text"
				value={currentValue}
				onChange={(event) => setCurrentValue(event.target.value)}
				placeholder={t("bSearch")}
				className="text-1xl h-10 w-full border-none bg-transparent outline-none placeholder:text-black dark:placeholder:text-white"
			></input>
			<input type="submit" className="hidden"></input>
		</form>
	);
}
