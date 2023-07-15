import CurrencySelect from "@/components/currencySelect";
import { loadExchangeState } from "@/shop-exchange-shared/loadExchangeState";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";

export async function CurrencyExchangeLoader({ className }: { className?: string }) {
	const exchangeState = await loadExchangeState();
	const currency = getCurrencyStatic();

	return (
		<CurrencySelect
			currency={currency}
			exchangeState={exchangeState}
			className={className}
		></CurrencySelect>
	);
}
