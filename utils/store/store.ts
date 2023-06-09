import {configureStore, createSlice, ThunkAction} from '@reduxjs/toolkit';
import {Action} from 'redux';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {bagSlice} from "@/utils/store/bagSlice";
import {currencySlice} from "@/utils/store/currencySlice";
import {exchangeSlice} from "@/utils/store/exchangeSlice";

const makeStore = () =>
    configureStore({
        reducer: {
            [bagSlice.name]: bagSlice.reducer,
            // [currencySlice.name]: currencySlice.reducer,
            // [exchangeSlice.name]: exchangeSlice.reducer,
        },
        devTools: true,
    });

// export type RootState = ReturnType<typeof makeStore>['getState'];
export type RootState = {
    [bagSlice.name]: ReturnType<typeof bagSlice.reducer>;
    // [currencySlice.name]: ReturnType<typeof currencySlice.reducer>;
    // // @ts-ignore
    // [exchangeSlice.name]: ReturnType<typeof exchangeSlice.reducer>;
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const wrapper = createWrapper<AppStore>(makeStore);
