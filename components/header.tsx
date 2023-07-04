import LanguageSelect from "@/components/languageSelect";
import HeaderBagButton from "@/components/headerBagButton";
import {CurrencyExchangeLoader} from "@/components/currencyExchangeLoader";
import HeaderLikesButton from "@/components/headerLikesButton";
import Image from "next/image";
import * as React from "react";
import Link from "next-intl/link";
import {Bars3Icon} from "@heroicons/react/24/solid";

export default async function Header() {
    return <div className="flex unicorn-background">
        <div className="flex w-full justify-center items-center">
            <div className="flex gap-2 flex-auto">
                <LanguageSelect className="hidden lg:flex"></LanguageSelect>
                <CurrencyExchangeLoader className="hidden lg:flex"></CurrencyExchangeLoader>
                <Bars3Icon className="h-16 w-16 lg:hidden text-white"></Bars3Icon>
            </div>
            <Link href="/">
                <Image
                    src="/img/unicorn_logo_small.png"
                    alt="Unicorn Store"
                    width="60"
                    height="60"
                ></Image>
            </Link>
            <div className="flex gap-2 flex-auto justify-end items-center">
                <HeaderLikesButton></HeaderLikesButton>
                <HeaderBagButton></HeaderBagButton>
            </div>
        </div>
    </div>;
}
