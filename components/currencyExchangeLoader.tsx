import CurrencySelect from "@/components/currencySelect";
import { loadExchangeState } from "@/shop-exchange-shared/loadExchangeState";
import { getCurrencyStatic } from "@/utils/exchange/getCurrencyStatic";

export async function CurrencyExchangeLoader({ className }: { className?: string }) {
	await loadExchangeState();
	const currency = await getCurrencyStatic();

	return <CurrencySelect currency={currency} className={className}></CurrencySelect>;
}
