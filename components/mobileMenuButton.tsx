"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import * as React from "react";

import useMobileViewScreen, { MobileViewScreenEnum } from "@/utils/seearch/useMobileViewScreen";

export default function MobileMenuButton({ className }: { className?: string }) {
	const [currentViewScreen, setCurrentViewScreen] = useMobileViewScreen();

	return (
		<Bars3Icon
			className="ml-2 h-14 w-14 cursor-pointer text-white lg:hidden"
			onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Menu)}
		></Bars3Icon>
	);
}
