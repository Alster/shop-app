import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";
import {useState} from "react";
import EventEmitter from "events";

export type BagState = Record<string, IBagItem>;

let state: BagState = {};

const events: EventEmitter = new EventEmitter();

export function addToBagStore(...items: IBagItem[]) {
    items.forEach((item) => {
        const key = createBagItemKey(item);
        if (state[key]) {
            state[key].quantity += item.quantity;
        }
        else {
            state[key] = item;
        }
    });
    storeState(state);
}

export function mergeBagStore(anotherStore: BagState) {
    state = {...state, ...anotherStore};
    storeState(state);
}

export function removeFromBagStore(...keys: string[]) {
    keys.forEach((key) => {
        delete state[key];
    });
    storeState(state);
}

export function useBagStore(): BagState {
    const [data, setData] = useState(state);
    events.on('change', setData);
    return data;
}

const storeState = (state: BagState) => {
    localStorage.setItem(LOCAL_STORAGE_BAG_KEY, JSON.stringify(state));
    events.emit('change', state);
}

export const createBagItemKey = (item: IBagItem) => {
    const sortedAttributes = Object.entries(item.attributes);
    sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(',')}`);
    return `${item.id}::${hash.join(';')}`;
};
