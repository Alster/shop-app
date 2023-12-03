import "../globals.css";

import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { PropsWithChildren } from "react";

import Header from "@/components/header";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: PropsWithChildren) {
	const locale = useLocale();

	let messages;
	try {
		const file = await import(`../../locales/${locale}.json`);
		messages = file.default;
	} catch {
		notFound();
	}

	console.log("render layout static");

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Header></Header>
					<Providers>{children}</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
