import {CURRENCY, CURRENCY_TO_SYMBOL} from "@/shop-shared/constants/exchange";

export function formatPrice(price: number, currency: CURRENCY): string {
    let priceString = price.toFixed(2);
    if (priceString.endsWith('.00')) {
        priceString = priceString.slice(0, -3);
    }

    const symbol = CURRENCY_TO_SYMBOL[currency];

    if (currency === CURRENCY.UAH) {
        return `${priceString} ${symbol}`;
    } else {
        return `${symbol}${priceString}`;
    }
}
