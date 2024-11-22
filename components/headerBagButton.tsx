"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { useEffect } from "react";

import CounterButton from "@/components/counterButton";
import { loadBag, useBagStore } from "@/utils/bag/bagItemsStorage";

export default function HeaderBagButton({ className }: { className?: string }) {
	const bagItems = useBagStore();

	useEffect(() => {
		loadBag();
	}, []);

	return (
		<CounterButton
			className={className}
			href="/bag"
			itemsCount={Object.values(bagItems).length}
		>
			<ShoppingBagIcon className="size-full" stroke="white" />
		</CounterButton>
	);
}
