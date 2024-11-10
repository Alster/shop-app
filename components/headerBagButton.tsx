"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

import { Link } from "@/i18n/routing";
import { loadBag, useBagStore } from "@/utils/bag/bagItemsStorage";

export default function HeaderBagButton() {
	const bagItems = useBagStore();

	useEffect(() => {
		loadBag();
	}, []);

	return (
		<Link
			href="/bag"
			className="
                            m-2 flex size-12 flex-none items-center justify-center text-slate-300
                        "
		>
			<ShoppingBagIcon className="size-16" stroke="white" />
			{Object.values(bagItems).length > 0 && (
				<div className="absolute mt-2 w-6 rounded-full bg-red-500 pb-0.5 text-center text-white">
					{Object.values(bagItems).length}
				</div>
			)}
		</Link>
	);
}
