import Image from "next/image";
import Link from "next-intl/link";
import * as React from "react";

import { CurrencyExchangeLoader } from "@/components/currencyExchangeLoader";
import HeaderBagButton from "@/components/headerBagButton";
import HeaderLikesButton from "@/components/headerLikesButton";
import LanguageSelect from "@/components/languageSelect";
import MobileMenuButton from "@/components/mobileMenuButton";

export default async function Header() {
	return (
		<div className="flex unicorn-background">
			<div className="flex w-full justify-center items-center">
				<div className="flex gap-2 flex-auto">
					<LanguageSelect className="hidden lg:flex"></LanguageSelect>
					<CurrencyExchangeLoader className="hidden lg:flex"></CurrencyExchangeLoader>
					<MobileMenuButton></MobileMenuButton>
				</div>
				<Link href="/">
					<Image
						src="/img/unicorn_logo_small.png"
						alt="Unicorn Store"
						width="60"
						height="60"
						priority={true}
					></Image>
				</Link>
				<div className="flex gap-2 flex-auto justify-end items-center">
					<HeaderLikesButton></HeaderLikesButton>
					<HeaderBagButton></HeaderBagButton>
				</div>
			</div>
		</div>
	);
}
