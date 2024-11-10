import { getRequestConfig } from "next-intl/server";

import { LanguageEnum } from "@/shop-shared/constants/localization";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	// This typically corresponds to the `[locale]` segment
	let locale = (await requestLocale) as LanguageEnum | undefined;

	// Ensure that a valid locale is used
	if (!locale || !routing.locales.includes(locale)) {
		locale = routing.defaultLocale;
	}

	const messages = await import(`../locales/${locale}.json`);

	return {
		locale,
		messages: messages.default,
	};
});
