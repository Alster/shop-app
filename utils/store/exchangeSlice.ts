import {createSlice} from "@reduxjs/toolkit";
import {HYDRATE} from "next-redux-wrapper";
import {ExchangeState} from "@/utils/exchange/helpers";

export const exchangeSlice = createSlice({
    name: 'bag',
    initialState: {} as ExchangeState,
    reducers: {
        add(state, action) {
            return {...state, ...action.payload};
        },
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
