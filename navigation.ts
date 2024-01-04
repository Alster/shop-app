import { createSharedPathnamesNavigation } from "next-intl/navigation";

import { LanguageEnum } from "@/shop-shared/constants/localization";

// export const locales = [LanguageEnum.en, LanguageEnum.ua] as const satisfies LanguageUnion[];
export const SupportedLocales = [LanguageEnum.en, LanguageEnum.ua, LanguageEnum.ru] as const;
export const DefaultLocale = LanguageEnum.en;

// export const locales = Object.values(LanguageEnum) as LanguageUnion[];
export const LocalePrefix = "always"; // Default

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales: SupportedLocales,
	localePrefix: LocalePrefix,
});
