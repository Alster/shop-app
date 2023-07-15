import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "next-intl/client";
import * as qs from "qs";
import { useState } from "react";

export default function TextSearchMobile({ className }: { className?: string }) {
	const pathname = usePathname();
	const searchParameters = useSearchParams();
	const router = useRouter();

	const pageQuery = qs.parse(searchParameters.toString()) as any;
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
				<MagnifyingGlassIcon className="w-6 h-6 mr-2"></MagnifyingGlassIcon>
			</div>
			<input
				type="text"
				value={currentValue}
				onChange={(e) => setCurrentValue(e.target.value)}
				placeholder={"Search"}
				className="h-14 bg-transparent border-none outline-none w-full placeholder-black dark:placeholder-white"
			></input>
			<input type="submit" className="hidden"></input>
		</form>
	);
}
