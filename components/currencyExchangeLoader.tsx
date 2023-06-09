import CurrencySelect from "@/components/currencySelect";
import {CURRENCIES} from "@/shop-shared/constants/exchange";
import {redisClient} from "@/utils/redisConnection";
import {createExchangeKey, ExchangeState, parseExchange} from "@/utils/exchange/helpers";
import {applyStaticExchange} from "@/utils/exchange/staticStore";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {getCookieStatic} from "@/utils/exchange/getCurrencyStatic";

export async function CurrencyExchangeLoader({ className }: { className?: string })  {
    const exchangeState: ExchangeState = {};

    const currencies = CURRENCIES.filter(currency => currency !== CURRENCY.UAH);
    const pipeline = redisClient.pipeline();
    currencies.forEach(currency => pipeline.get(createExchangeKey(currency, CURRENCY.UAH)));
    const res = await pipeline.exec();
    if (!res) {
        throw new Error(`Cannot get exchange rates from redis`);
    }

    currencies.forEach((currency, index) => {
        const [error, value] = res[index];
        if (error) {
            throw error;
        }
        const key = createExchangeKey(currency, CURRENCY.UAH);
        const exchange = parseExchange(value as string);
        exchangeState[key] = exchange;
    });

    applyStaticExchange(exchangeState);

    const currencyStatic = getCookieStatic("currency");
    const currency = currencyStatic?.value as CURRENCY || CURRENCY.UAH;

    return <CurrencySelect
        currency={currency}
        exchangeState={exchangeState}
        className={className}
    ></CurrencySelect>
}
