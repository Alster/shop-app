"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

import { Link } from "@/navigation";
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
                            m-2 flex h-12 w-12 flex-none items-center justify-center text-slate-300
                        "
		>
			<ShoppingBagIcon className="h-16 w-16" stroke="white" />
			{Object.values(bagItems).length > 0 && (
				<div className="absolute mt-2 w-6 rounded-full bg-red-500 pb-0.5 text-center text-white">
					{Object.values(bagItems).length}
				</div>
			)}
		</Link>
	);
}
