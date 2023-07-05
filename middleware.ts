import createMiddleware from 'next-intl/middleware';
import {LanguageEnum} from "@/shop-shared/constants/localization";

export default createMiddleware({
    // A list of all locales that are supported
    locales: Object.values(LanguageEnum),

    // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
    defaultLocale: LanguageEnum.EN,
});

export const config = {
    // Skip all paths that should not be internationalized
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
