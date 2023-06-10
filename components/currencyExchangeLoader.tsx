import CurrencySelect from "@/components/currencySelect"
import {getCurrencyStatic} from "@/utils/exchange/getCurrencyStatic";
import {loadExchangeState} from "@/shop-exchange-shared/loadExchangeState";

export async function CurrencyExchangeLoader({ className }: { className?: string })  {
    const exchangeState = await loadExchangeState();
    const currency = getCurrencyStatic();

    return <CurrencySelect
        currency={currency}
        exchangeState={exchangeState}
        className={className}
    ></CurrencySelect>
}
