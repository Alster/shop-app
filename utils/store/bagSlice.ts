import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";
import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {AppState} from "@/utils/store/store";

export type BagState = Record<string, IBagItem>;

export const createBagItemKey = (item: IBagItem) => {
    const sortedAttributes = Object.entries(item.attributes);
    sortedAttributes.sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
    const hash = sortedAttributes.map(([key, values]) => `${key}:${values.join(',')}`);
    return `${item.id}::${hash.join(';')}`;
};

const storeState = (state: BagState) => {
    localStorage.setItem(LOCAL_STORAGE_BAG_KEY, JSON.stringify(state));
}

export const bagSlice = createSlice({
    name: 'bag',
    initialState: {} as BagState,
    reducers: {
        merge(state, action) {
            const newState = {...state, ...action.payload};
            storeState(newState);
            return newState;
        },
        add(state, action) {
            const key = createBagItemKey(action.payload);
            if (state[key]) {
                state[key].quantity += action.payload.quantity;
            }
            else {
                state[key] = action.payload;
            }
            storeState(state);
            return state;
        },
        remove(state, action) {
            delete state[action.payload];
            storeState(state);
        }
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            console.log('HYDRATE', state, action.payload);
            return {
                ...state,
                ...action.payload.subject,
            };
        },
    },
});

export const selectSubject = (id: any) => (state: AppState) => state?.[bagSlice.name]?.[id];
