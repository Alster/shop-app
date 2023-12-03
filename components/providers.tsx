"use client";

import { Fragment, PropsWithChildren } from "react";

import { ThemeContext } from "@/utils/some.context";

export function Providers({ children }: PropsWithChildren) {
	console.log("render providers client");
	return (
		<Fragment>
			<ThemeContext.Provider value={"kek"}>{children}</ThemeContext.Provider>
		</Fragment>
	);
}
