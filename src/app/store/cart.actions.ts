import { createAction, props } from '@ngrx/store';
import { ProductCartItem } from './cart.state';


export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ product: ProductCartItem }>()
);

export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');