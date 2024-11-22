"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import * as React from "react";
import { useEffect } from "react";

import CounterButton from "@/components/counterButton";
import { loadLikes, useLikesStore } from "@/utils/likes/likeItemsStorage";

export default function HeaderLikesButton({ className }: { className?: string }) {
	const likeItems = useLikesStore();

	useEffect(() => {
		loadLikes();
	}, []);

	return (
		<CounterButton
			className={className}
			href="/likes"
			itemsCount={Object.values(likeItems).length}
		>
			<HeartIcon className="size-full" stroke="white" />
		</CounterButton>
	);
}
