import { getRequestConfig } from "next-intl/server";

import { DefaultLocale, SupportedLocales } from "@/navigation";
import { LanguageEnum } from "@/shop-shared/constants/localization";

export default getRequestConfig(async ({ locale }) => {
	const messages = await import(
		`./locales/${
			SupportedLocales.includes(locale as LanguageEnum) ? locale : DefaultLocale
		}.json`
	);

	return {
		messages: messages.default,
		locale,
	};
});
