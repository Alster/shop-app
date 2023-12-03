import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import * as qs from "qs";
import { useState } from "react";

import { usePathname, useRouter } from "@/navigation";
import { IFindProductsQuery } from "@/utils/products/iFindProductsQuery";

export default function TextSearchMobile({ className }: { className?: string }) {
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

	const onSubmit = (event: any) => {
		event.preventDefault();
		router.push(targetHref);
	};

	return (
		<form onSubmit={onSubmit} className={`${className} flex`}>
			<div className="flex items-center">
				<MagnifyingGlassIcon className="mr-2 h-6 w-6"></MagnifyingGlassIcon>
			</div>
			<input
				type="text"
				value={currentValue}
				onChange={(e) => setCurrentValue(e.target.value)}
				placeholder={"Search"}
				className="h-14 w-full border-none bg-transparent outline-none placeholder:text-black dark:placeholder:text-white"
			></input>
			<input type="submit" className="hidden"></input>
		</form>
	);
}
