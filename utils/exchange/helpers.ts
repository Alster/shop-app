import {CURRENCY, CURRENCY_TO_ISO_4217} from "@/shop-shared/constants/exchange";

export type ExchangeType = {
    buy: number;
    sell: number;
}
export type ExchangeState = Record<string, ExchangeType>;

export const createExchangeKey = (currencyFrom: CURRENCY, currencyTo: CURRENCY) => {
    return `${CURRENCY_TO_ISO_4217[currencyFrom]}_${CURRENCY_TO_ISO_4217[currencyTo]}`
};

export const parseExchange = (value: string): ExchangeType => {
    const [buyString, sellString] = value.split('_');
    return {
        buy: parseFloat(buyString),
        sell: parseFloat(sellString),
    };
};
