"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import * as React from "react";

import useMobileViewScreen, { MobileViewScreenEnum } from "@/utils/seearch/useMobileViewScreen";

export default function MobileMenuButton({ className }: { className?: string }) {
	const [currentViewScreen, setCurrentViewScreen] = useMobileViewScreen();

	return (
		<Bars3Icon
			className="h-16 w-16 lg:hidden text-white cursor-pointer"
			onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Menu)}
		></Bars3Icon>
	);
}
