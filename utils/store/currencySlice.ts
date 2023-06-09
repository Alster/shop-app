import {createSlice} from "@reduxjs/toolkit";
import {CURRENCY} from "@/shop-shared/constants/exchange";
import {HYDRATE} from "next-redux-wrapper";

export const currencySlice = createSlice({
    name: 'currency',
    initialState: CURRENCY.UAH as CURRENCY,
    reducers: {
        set(state, action) {
            return action.payload;
        },
    },

    extraReducers: {
        [HYDRATE]: (state, action) => {
            return action.payload;
        },
    },
});
