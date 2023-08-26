"use client";

import { Fragment, ReactElement } from "react";

import { ThemeContext } from "@/utils/some.context";

export function Providers({ children }: { children: ReactElement[] }) {
	console.log("render providers client");
	return (
		<Fragment>
			<ThemeContext.Provider value={"kek"}>{children}</ThemeContext.Provider>
		</Fragment>
	);
}
