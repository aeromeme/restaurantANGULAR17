import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './cart.state';
import { cartReducer } from './cart.reducer';

export const reducers: ActionReducerMap<AppState> = {
  cart: cartReducer,
};