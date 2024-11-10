import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

import { DefaultLocale, LocalePrefix, SupportedLocales } from "@/i18n/locales";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: SupportedLocales,

	// Used when no locale matches
	defaultLocale: DefaultLocale,

	localePrefix: LocalePrefix,

	localeDetection: true,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
