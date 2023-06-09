import {CURRENCY} from "@/shop-shared/constants/exchange";
import {createExchangeKey, ExchangeState} from "@/utils/exchange/helpers";

export const doExchange = (
    currencyFrom: CURRENCY,
    currencyTo: CURRENCY,
    amount: number,
    exchangeState: ExchangeState,
): number => {
    if (currencyFrom === currencyTo) {
        return amount;
    }

    console.log('doExchange', currencyFrom, currencyTo, amount, exchangeState)

    if (currencyTo === CURRENCY.UAH) {
        const key = createExchangeKey(currencyFrom, currencyTo);
        const exchange = exchangeState[key];
        console.log('Got exchange:', key, exchange);
        return amount * exchange.sell;
    }
    else if (currencyFrom === CURRENCY.UAH) {
        const key = createExchangeKey(currencyTo, currencyFrom);
        const exchange = exchangeState[key];
        console.log('Got exchange:', key, exchange);
        return amount / exchange.sell;
    } else {
        return -1;
    }
}
