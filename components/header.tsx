import LanguageSelect from "@/components/languageSelect";
import HeaderBagButton from "@/components/headerBagButton";
import {CurrencyExchangeLoader} from "@/components/currencyExchangeLoader";
import HeaderLikesButton from "@/components/headerLikesButton";
import Image from "next/image";
import * as React from "react";

export default async function Header() {
    return <div className="flex bg-purple-500">
        <div className="flex w-full justify-center">
            <div className="flex gap-2 flex-auto">
                <LanguageSelect className="pt-4"></LanguageSelect>
                <CurrencyExchangeLoader className="pt-4"></CurrencyExchangeLoader>
            </div>
            <div>
                <Image
                    src="/img/unicorn_logo_small.png"
                    alt="Nova Poshta"
                    width="60"
                    height="60"
                ></Image>
            </div>
            <div className="flex gap-2 flex-auto justify-end">
                <HeaderLikesButton></HeaderLikesButton>
                <HeaderBagButton></HeaderBagButton>
            </div>
        </div>
    </div>;
}
