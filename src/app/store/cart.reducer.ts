import { createReducer, on } from '@ngrx/store';
import { CartState, CartItem } from './cart.state';
import * as CartActions from './cart.actions';

export const initialState: CartState = {
  items: [],
};

export const cartReducer = createReducer(
  initialState,
  on(CartActions.addToCart, (state, { product }) => {
    const existingItem = state.items.find(item => item.product.id === product.id);
    if (existingItem) {
      return {
        ...state,
        items: state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      };
    } else {
      return {
        ...state,
        items: [...state.items, { product, quantity: 1 }],
      };
    }
  }),
  on(CartActions.removeFromCart, (state, { productId }) => ({
    ...state,
    items: state.items.filter(item => item.product.id !== productId),
  })),
  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return {
        ...state,
        items: state.items.filter(item => item.product.id !== productId),
      };
    }
    return {
      ...state,
      items: state.items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    };
  }),
  on(CartActions.clearCart, state => ({
    ...state,
    items: [],
  }))
);