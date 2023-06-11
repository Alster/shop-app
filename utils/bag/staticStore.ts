import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";
import {useEffect, useState} from "react";
import EventEmitter from "events";

export type BagState = Record<string, IBagItem>;

let _state: BagState = {};

const events: EventEmitter = new EventEmitter();
const CHANGE_KEY = 'change';

export function addToBagStore(...items: IBagItem[]) {
    items.forEach((item) => {
        const key = createBagItemKey(item);
        if (_state[key]) {
            throw new Error(`Item with key ${key} already exists in bag`);
        }
        _state[key] = item;
    });
    storeState();
}

export function mergeBagStore(anotherStore: BagState) {
    _state = {..._state, ...anotherStore};
    storeState();
}

export function removeFromBagStore(...keys: string[]) {
    keys.forEach((key) => {
        delete _state[key];
    });
    storeState();
}

export function useBagStore(callee: string): BagState {
    const [data, setData] = useState({..._state});
    useEffect(() => {
        setData({..._state});

        function listener(newState: BagState) {
            setData(newState);
        }

        events.on(CHANGE_KEY, listener);

        return () => {
            events.off(CHANGE_KEY, listener);
        }
    }, []);
    return data;
}

const storeState = () => {
    localStorage.setItem(LOCAL_STORAGE_BAG_KEY, JSON.stringify(_state));
    events.emit(CHANGE_KEY, {..._state});
}

export const createBagItemKey = (item: IBagItem) => {
    const sortedAttributes = Object.entries(item.attributes);
    sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(',')}`);
    return `${item.productId}::${hash.join(';')}`;
};
