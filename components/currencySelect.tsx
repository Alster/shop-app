"use client"

import {Fragment, useState} from "react";
import {CURRENCIES, CURRENCY, CURRENCY_TO_SYMBOL} from "@/shop-shared/constants/exchange";
import {ExchangeState} from "@/shop-exchange-shared/helpers";
import {getCookie, setCookie} from "@/shop-exchange-shared/cookieClientHelper";
import {useRouter} from "next-intl/client";
import {getCurrencyClient} from "@/shop-exchange-shared/getCurrencyClient";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

interface DropdownListItemInterface {
    key: string,
    title: string,
    selected: boolean,
}

const CURRENCIES_LIST: DropdownListItemInterface[] = CURRENCIES.map(currency => ({
    key: currency,
    title: `${currency} ${CURRENCY_TO_SYMBOL[currency]}`,
    selected: false,
}));

export default function CurrencySelect(
    { exchangeState, currency, className }: {
        exchangeState: ExchangeState,
        currency: CURRENCY,
        className?: string,
    }
) {
    const router = useRouter();

    const [isListOpen, setIsListOpen] = useState(false);
    const toggleList = () => {
        setIsListOpen(!isListOpen);
    };

    const getCurrencyByKey = (key: string) => {
        const foundCurrentLanguage = CURRENCIES_LIST.find(item => item.key === key);
        if (!foundCurrentLanguage) {
            throw new Error(`Currency ${currency} not found in CURRENCIES_LIST`);
        }
        return foundCurrentLanguage;
    };

    const initialCurrency = getCurrencyByKey(currency);
    initialCurrency.selected = true;
    const [selectedCurrency, setSelectedCurrency] = useState<DropdownListItemInterface>(initialCurrency);

    const selectCurrency = (key: string) => {
        selectedCurrency.selected = false;
        const foundCurrentCurrency = getCurrencyByKey(key);
        foundCurrentCurrency.selected = true;
        setSelectedCurrency(foundCurrentCurrency);
        setCookie("currency", foundCurrentCurrency.key, 30);
        router.refresh();
        toggleList();
    }

    const drawItem = (item: DropdownListItemInterface) => {
        return <Fragment>
            <div className="p-1">{item.title}</div>
        </Fragment>
    };

    return <div className={className}>
        {!isListOpen && (
            <button
                className=""
                type="button"
                onClick={toggleList}
            >
                <div className="flex flex-wrap text-white">
                    <ChevronDownIcon className="pt-1 h-7 w-7 text-white inline-block" /> {drawItem(selectedCurrency)}
                </div>
            </button>
        )}
        {isListOpen && (
            <div
                className="absolute bg-white dark:bg-black border-2 border-black dark:border-white"
            >
                {CURRENCIES_LIST.map((item) => (
                    <div key={item.key}>
                        <button
                            className="flex flex-wrap hover:bg-gray-500"
                            onClick={() => selectCurrency(item.key)}
                        >
                            {drawItem(item)}
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
}
