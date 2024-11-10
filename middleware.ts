import createMiddleware from "next-intl/middleware";

import { routing } from "@/i18n/routing";

export default createMiddleware(routing);

export const config = {
	matcher: [
		"/", // Required when i18n is enabled, otherwise middleware won't be executed on index route
		"/((?!api|_next/static|_next/image|img|favicon.png).*)",
	],
};
