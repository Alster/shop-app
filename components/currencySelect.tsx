"use client";

import { useRouter } from "@/i18n/routing";
import { CURRENCIES, CURRENCY_TO_SYMBOL, CurrencyEnum } from "@/shop-shared/constants/exchange";
import { setCookie } from "@/utils/exchange/cookieClientHelper";
import useCurrency from "@/utils/exchange/useCurrency";

interface IDropdownListItemInterface {
	key: CurrencyEnum;
	title: string;
	selected: boolean;
}

const CURRENCIES_LIST: IDropdownListItemInterface[] = CURRENCIES.map((currency) => ({
	key: currency,
	title: `${currency} ${CURRENCY_TO_SYMBOL[currency]}`,
	selected: false,
}));

export default function CurrencySelect({
	currency: initialCurrency,
	className,
}: {
	currency: CurrencyEnum;
	className?: string;
}) {
	const [currency, setCurrency] = useCurrency(initialCurrency);
	const router = useRouter();

	const selectCurrency = async (key: CurrencyEnum) => {
		setCurrency(key);
		await setCookie("currency", key, 30);
		router.refresh();
	};

	return (
		<div className={className}>
			<select
				className="unicorn-background"
				onChange={async (event) => selectCurrency(event.target.value as CurrencyEnum)}
			>
				{CURRENCIES_LIST.map((item) => (
					<option key={item.key} value={item.key} selected={item.key === currency}>
						{item.title}
					</option>
				))}
			</select>
		</div>
	);
}
