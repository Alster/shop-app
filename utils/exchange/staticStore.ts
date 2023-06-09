import {ExchangeState} from "@/utils/exchange/helpers";

let staticExchange: ExchangeState = {};

const awaiters: Function[] = [];

export function applyStaticExchange(exchange: ExchangeState) {
    staticExchange = exchange;
    awaiters.forEach((resolve) => resolve(exchange));
    awaiters.length = 0;
}

export async function getStaticExchange(): Promise<ExchangeState> {
    if (Object.keys(staticExchange).length) {
        return staticExchange;
    }

    return new Promise((resolve) => {
        awaiters.push(resolve);
    });
}
