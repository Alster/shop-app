import { IBagItem, IBagItemKeySource } from "@/utils/bag/iBagItem";
import { LocalListStorage, useLocalListStorage } from "@/utils/localListStorage";

const LOCAL_STORAGE_KEY = "bag";

export const createBagItemKey = (bagItem: IBagItemKeySource) => {
	return `${bagItem.productId}::${bagItem.item.sku}`;
};

export const bagStore = new LocalListStorage<IBagItem>(LOCAL_STORAGE_KEY, createBagItemKey);

export const loadBag = () => {
	const items: Record<string, IBagItem> = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEY) || "{}",
	);
	bagStore.mergeStore(items);

	console.log("Bag loaded");
};

export function useBagStore() {
	return useLocalListStorage(bagStore);
}
