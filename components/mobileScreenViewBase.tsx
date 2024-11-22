import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import * as React from "react";

import { MobileViewScreenEnum } from "@/utils/search/mobileViewScreenEnum";
import useMobileViewScreen from "@/utils/search/useMobileViewScreen";

export default function MobileScreenViewBase({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const [, setCurrentViewScreen] = useMobileViewScreen();

	return (
		<div className="fixed top-0 size-full">
			<div className="flex size-full flex-col overflow-y-auto bg-white dark:bg-slate-800">
				<div className="unicorn-background flex items-center">
					<button
						onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Catalog)}
						className=" flex size-16 items-center justify-end font-medium uppercase tracking-wider
                             "
					>
						<ChevronLeftIcon className="inline-block size-12"></ChevronLeftIcon>
					</button>
					<div className="flex-auto pl-2 text-3xl">{title}</div>
				</div>
				{children}
			</div>
		</div>
	);
}
