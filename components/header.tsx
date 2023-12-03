import Image from "next/image";
import * as React from "react";

import { CurrencyExchangeLoader } from "@/components/currencyExchangeLoader";
import HeaderBagButton from "@/components/headerBagButton";
import HeaderLikesButton from "@/components/headerLikesButton";
import LanguageSelect from "@/components/languageSelect";
import MobileMenuButton from "@/components/mobileMenuButton";
import { Link } from "@/navigation";

export default async function Header() {
	return (
		<div className="unicorn-background flex">
			<div className="flex w-full items-center justify-center">
				<div className="flex flex-auto gap-2">
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
				<div className="flex flex-auto items-center justify-end gap-2">
					<HeaderLikesButton></HeaderLikesButton>
					<HeaderBagButton></HeaderBagButton>
				</div>
			</div>
		</div>
	);
}
