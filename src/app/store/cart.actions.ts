import { createAction, props } from '@ngrx/store';
import { ProductDto } from '../api/models';

export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ product: ProductDto }>()
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