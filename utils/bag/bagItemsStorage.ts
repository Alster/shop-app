import {IBagItem, IBagItemKeySource} from "@/utils/bag/IBagItem";
import {LocalListStorage, useLocalListStorage} from "@/utils/localListStorage";

const LOCAL_STORAGE_KEY = 'bag';

export const createBagItemKey = (item: IBagItemKeySource) => {
    const sortedAttributes = Object.entries(item.attributes);
    sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(',')}`);
    return `${item.productId}::${hash.join(';')}`;
};

export const bagStore = new LocalListStorage<IBagItem>(LOCAL_STORAGE_KEY, createBagItemKey);

export const loadBag = () => {
    const items: Record<string, IBagItem> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "{}");
    bagStore.mergeStore(items)
}

export function useBagStore() {
    return useLocalListStorage(bagStore);
}
