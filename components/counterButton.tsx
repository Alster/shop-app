import * as React from "react";

import { Link } from "@/i18n/routing";

export default function CounterButton({
	className,
	children,
	href,
	itemsCount,
}: {
	className?: string;
	children: React.ReactNode;
	href: string;
	itemsCount: number;
}) {
	return (
		<Link
			href={href}
			className={
				className + " m-1 flex size-12 flex-none items-center justify-center text-slate-300"
			}
		>
			<div className="size-16">{children}</div>
			{itemsCount > 0 && (
				<div className="absolute ml-8 mt-5 w-6 rounded-full bg-red-500 pb-0.5 text-center text-white">
					{itemsCount}
				</div>
			)}
		</Link>
	);
}
