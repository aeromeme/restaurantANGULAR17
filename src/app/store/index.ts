import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CartState } from './cart.state';
import { cartReducer } from './cart.reducer';

export interface AppState {
  cart: CartState;
}

export const reducers: ActionReducerMap<AppState> = {
  cart: cartReducer,
};

export const metaReducers: MetaReducer<AppState>[] = [
  localStorageSync({ keys: ['cart'], rehydrate: true })
];