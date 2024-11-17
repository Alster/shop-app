"use client";

import { Bars3Icon } from "@heroicons/react/24/solid";
import * as React from "react";

import { MobileViewScreenEnum } from "@/utils/search/mobileViewScreenEnum";
import useMobileViewScreen from "@/utils/search/useMobileViewScreen";

export default function MobileMenuButton() {
	const [, setCurrentViewScreen] = useMobileViewScreen();

	return (
		<Bars3Icon
			className="ml-2 size-14 cursor-pointer text-white lg:hidden"
			onClick={() => setCurrentViewScreen(MobileViewScreenEnum.Menu)}
		></Bars3Icon>
	);
}
