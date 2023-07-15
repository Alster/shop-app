"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next-intl/link";
import { useEffect } from "react";

import { loadLikes, useLikesStore } from "@/utils/likes/likeItemsStorage";

export default function HeaderLikesButton() {
	const likeItems = useLikesStore();

	useEffect(() => {
		loadLikes();
	}, []);

	return (
		<Link
			href="/likes"
			className="
                            m-2 flex-none flex items-center justify-center w-12 h-12 text-slate-300
                        "
		>
			<HeartIcon className="h-16 w-16" stroke="white" />
			{Object.values(likeItems).length > 0 && (
				<div className="absolute w-6 bg-red-500 rounded-full text-white text-center pb-0.5 mt-2">
					{Object.values(likeItems).length}
				</div>
			)}
		</Link>
	);
}
