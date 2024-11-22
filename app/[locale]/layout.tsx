import "../globals.css";

import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { PropsWithChildren } from "react";

import Body from "@/components/body";
import Header from "@/components/header";
import { Providers } from "@/components/providers";
import { routing } from "@/i18n/routing";
import { LanguageEnum } from "@/shop-shared/constants/localization";
import { pipe } from "@/shop-shared/utils/pipe";
import { getCookieStatic } from "@/utils/exchange/getCookieStatic";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";
import { fetchCategoryTree } from "@/utils/fetchCategoryTree";

const inter = Inter({ subsets: ["latin"] });

interface IParametersCategories {
	categories: string[];
	locale: LanguageEnum;
}

export default async function LocaleLayout({
	children,
	params,
}: PropsWithChildren & { params: Promise<IParametersCategories> }) {
	const { locale } = await params;

	// console.log("locale", locale);

	// // Ensure that the incoming `locale` is valid
	if (!routing.locales.includes(locale)) {
		console.error(`Invalid locale: ${locale}. Allowed locales: ${routing.locales.join(", ")}`);
		notFound();
	}

	setRequestLocale(locale);

	const [currency, lastSelectedCategories, messages, categoryTree] = await Promise.all([
		getCurrencyStatic(),
		getCookieStatic("lastSelectedCategories"),
		getMessages(),
		fetchCategoryTree(locale),
	]);

	const selectedCategories = pipe(
		lastSelectedCategories,
		(value) => (value ? value.value : ""),
		(value) => value.split("|"),
	);

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider messages={messages}>
					<Header></Header>
					<Providers>
						<Body
							categories={categoryTree}
							selectedCategories={selectedCategories}
							currency={currency}
						>
							{children}
						</Body>
					</Providers>
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
