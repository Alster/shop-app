import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { localePrefix, locales } from "@/navigation";
import { LanguageEnum } from "@/shop-shared/constants/localization";

export default async function middleware(request: NextRequest) {
	// Step 1: Use the incoming request (example)
	const defaultLocale =
		(request.headers.get("x-default-locale") as LanguageEnum) ?? LanguageEnum.en;

	// Step 2: Create and call the next-intl middleware (example)
	const handleI18nRouting = createIntlMiddleware({
		localePrefix,
		locales,
		defaultLocale,
	});
	const response = handleI18nRouting(request);

	// Step 3: Alter the response (example)
	response.headers.set("x-default-locale", defaultLocale);

	return response;
}

export const config = {
	// // Skip all paths that should not be internationalized
	matcher: ["/((?!api|_next|.*\\..*).*)"],

	// Match only internationalized pathnames
	// matcher: ["/", `/(${Object.values(LanguageEnum).join("|")})/:path*`],
};
