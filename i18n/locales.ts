import { LanguageEnum } from "@/shop-shared/constants/localization";

export const SupportedLocales = [LanguageEnum.en, LanguageEnum.ua, LanguageEnum.ru] as const;
export const DefaultLocale = LanguageEnum.en;

// export const locales = Object.values(LanguageEnum) as LanguageUnion[];
export const LocalePrefix = "always"; // Default
