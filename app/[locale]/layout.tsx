import "../globals.css";

import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { PropsWithChildren } from "react";

import Header from "@/components/header";
import { Providers } from "@/components/providers";
import { routing } from "@/i18n/routing";
import { LanguageEnum } from "@/shop-shared/constants/localization";

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleLayout({
	children,
	params,
}: PropsWithChildren & { params: Promise<{ locale: LanguageEnum }> }) {
	const { locale } = await params;

	console.log("locale", locale);

	// // Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale)) {
		console.error(`Invalid locale: ${locale}. Allowed locales: ${routing.locales.join(", ")}`);
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<Header></Header>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}

// eslint-disable-next-line unicorn/prevent-abbreviations
export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: LanguageEnum }> }) {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata" });
	return {
		title: t("title"),
		description: t("description"),
	};
}
