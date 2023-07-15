import { ILikeItem, ILikeItemKeySource } from "@/utils/likes/iLikeItem";
import { LocalListStorage, useLocalListStorage } from "@/utils/localListStorage";

const LOCAL_STORAGE_KEY = "likes";

export const createLikeItemKey = (item: ILikeItemKeySource) => {
	const sortedAttributes = Object.entries(item.attributes);
	sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
	const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(",")}`);
	return `${item.productId}::${hash.join(";")}`;
};

export const likeStore = new LocalListStorage<ILikeItem>(LOCAL_STORAGE_KEY, createLikeItemKey);

export const loadLikes = () => {
	const items: Record<string, ILikeItem> = JSON.parse(
		localStorage.getItem(LOCAL_STORAGE_KEY) || "{}",
	);
	likeStore.mergeStore(items);
};

export function useLikesStore() {
	return useLocalListStorage(likeStore);
}
