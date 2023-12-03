"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

import { Link } from "@/navigation";
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
                            m-2 flex h-12 w-12 flex-none items-center justify-center text-slate-300
                        "
		>
			<HeartIcon className="h-16 w-16" stroke="white" />
			{Object.values(likeItems).length > 0 && (
				<div className="absolute mt-2 w-6 rounded-full bg-red-500 pb-0.5 text-center text-white">
					{Object.values(likeItems).length}
				</div>
			)}
		</Link>
	);
}
