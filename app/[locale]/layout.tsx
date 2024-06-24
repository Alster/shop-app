import "../globals.css";

import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { PropsWithChildren } from "react";

import Header from "@/components/header";
import { Providers } from "@/components/providers";
import i18n from "@/i18n";
import { SupportedLocales } from "@/navigation";
import { LanguageEnum } from "@/shop-shared/constants/localization";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
	children,
	params: { locale },
}: PropsWithChildren & { params: { locale: LanguageEnum } }) {
	unstable_setRequestLocale(locale);

	const intlConfig = await i18n({ locale });

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider {...intlConfig}>
					<Header></Header>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function generateStaticParams() {
	return SupportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({
	params: { locale },
}: {
	params: { locale: LanguageEnum };
}) {
	const t = await getTranslations("Metadata");
	return {
		title: t("title"),
		description: t("description"),
	};
}
