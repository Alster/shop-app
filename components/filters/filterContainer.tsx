import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import * as React from "react";
import { ReactNode, useState } from "react";

export default function FilterContainer({
	title,
	selectedCount,
	children,
	className,
}: {
	title: string;
	selectedCount: number;
	children: ReactNode;
	className?: string;
}) {
	const [showList, setShowList] = useState<boolean>(false);

	return (
		<div
			className="px-2 py-1"
			onMouseEnter={() => setShowList(true)}
			onMouseLeave={() => setShowList(false)}
		>
			<div className="flex cursor-pointer" onClick={() => setShowList(!showList)}>
				{showList ? (
					<ChevronUpIcon className="inline-block h-7 w-7" />
				) : (
					<ChevronDownIcon className="inline-block h-7 w-7" />
				)}
				{title}
				{selectedCount > 0 && (
					<span>
						<span className="unicorn-background ml-1 inline-block w-5 rounded-full pb-0.5 text-center text-sm text-white">
							{selectedCount}
						</span>{" "}
					</span>
				)}
				{selectedCount === 0 && (
					<span>
						<span className="ml-1 inline-block w-5 pb-0.5"></span>
					</span>
				)}
			</div>
			<div className="flex">
				<div>
					{showList && (
						<div
							className={`${className} z-10 flex max-w-sm flex-wrap border-2 border-gray-500 bg-white p-2 md:absolute dark:bg-black`}
						>
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
