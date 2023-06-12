import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";
import {ProductAttributesDto} from "@/shop-shared/dto/product/product.dto";
import {LocalListStorage, useLocalListStorage} from "@/utils/localListStorage";

interface IWithProductAttributes {
    productId: string;
    attributes: ProductAttributesDto;
}

export const createBagItemKey = (item: IWithProductAttributes) => {
    const sortedAttributes = Object.entries(item.attributes);
    sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(',')}`);
    return `${item.productId}::${hash.join(';')}`;
};

export const bagStore = new LocalListStorage<IBagItem>(LOCAL_STORAGE_BAG_KEY, createBagItemKey);

export const loadBag = () => {
    const items: Record<string, IBagItem> = JSON.parse(localStorage.getItem(LOCAL_STORAGE_BAG_KEY) || "{}");
    bagStore.mergeStore(items)
}

export function useBagStore() {
    return useLocalListStorage(bagStore);
}
