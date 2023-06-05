import {configureStore, createSlice, ThunkAction} from '@reduxjs/toolkit';
import {Action} from 'redux';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {IBagItem} from "@/utils/bag/IBagItem";
import {LOCAL_STORAGE_BAG_KEY} from "@/utils/bag/constants";

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

const makeStore = () =>
    configureStore({
        reducer: {
            [bagSlice.name]: bagSlice.reducer,
        },
        devTools: true,
    });

// export type RootState = ReturnType<typeof makeStore>['getState'];
export type RootState = {
    [bagSlice.name]: ReturnType<typeof bagSlice.reducer>;
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// export const fetchSubject =
//     (id: any): AppThunk =>
//         async dispatch => {
//             const timeoutPromise = (timeout: number) => new Promise(resolve => setTimeout(resolve, timeout));
//
//             await timeoutPromise(200);
//
//             dispatch(
//                 subjectSlice.actions.setEnt({
//                     [id]: {
//                         id,
//                         name: `Subject ${id}`,
//                     },
//                 }),
//             );
//         };

export const wrapper = createWrapper<AppStore>(makeStore);

export const selectSubject = (id: any) => (state: AppState) => state?.[bagSlice.name]?.[id];

// import {createStore, AnyAction, Store, applyMiddleware} from 'redux';
// import {createWrapper, Context, HYDRATE} from 'next-redux-wrapper';
// import thunkMiddleware from 'redux-thunk';
// import {IBagItem} from "@/utils/bag/IBagItem";
//
// export type State = IBagItem[];
//
// // create your reducer
// const reducer = (state: State = [], action: AnyAction) => {
//     switch (action.type) {
//         case HYDRATE:
//             // Attention! This will overwrite client state! Real apps should use proper reconciliation.
//             return [...state, ...action.payload];
//         case 'ADD':
//             return [...state, action.payload];
//         default:
//             return state;
//     }
// };
//
// // create a makeStore function
// const makeStore = (context: Context) => createStore(reducer, applyMiddleware(thunkMiddleware));
//
// // export an assembled wrapper
// export const wrapper = createWrapper<Store<State>>(makeStore, {debug: true});







// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
// import thunkMiddleware from 'redux-thunk';
// import rootReducer from './reducers';
//
// // Create the Redux store
// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
//
// export default store;
