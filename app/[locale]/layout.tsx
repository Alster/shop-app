import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';

export default function LocaleLayout({children, params}: any) {
    const locale = useLocale();

    // Show a 404 error if the user requests an unknown locale
    if (params.locale !== locale) {
        notFound();
    }

    return (
        <html lang={locale}>
        <body>{children}</body>
        </html>
    );
}
