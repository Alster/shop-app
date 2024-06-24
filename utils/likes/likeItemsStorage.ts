import { ILikeItem, ILikeItemKeySource } from "@/utils/likes/iLikeItem";
import { LocalListStorage, useLocalListStorage } from "@/utils/localListStorage";

const LOCAL_STORAGE_KEY = "likes";

export const createLikeItemKey = (item: ILikeItemKeySource) => {
	return `${item.productId}::${item.item.sku}`;
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
