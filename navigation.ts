import { createSharedPathnamesNavigation } from "next-intl/navigation";

import { LanguageEnum } from "@/shop-shared/constants/localization";

// export const locales = [LanguageEnum.en, LanguageEnum.ua] as const satisfies LanguageUnion[];
export const locales = [LanguageEnum.en, LanguageEnum.ua, LanguageEnum.ru] as const;

// export const locales = Object.values(LanguageEnum) as LanguageUnion[];
export const localePrefix = "always"; // Default

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales,
	localePrefix,
});
