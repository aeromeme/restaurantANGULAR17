import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ProductDto } from '../../api/models';
import { CartItem, ProductCartItem } from '../../store/cart.state';
import * as CartActions from '../../store/cart.actions';
import * as CartSelectors from '../../store/cart.selectors';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private store: Store) {}

  get cartItems$(): Observable<CartItem[]> {
    return this.store.select(CartSelectors.selectCartItems);
  }

  get totalItems$(): Observable<number> {
    return this.store.select(CartSelectors.selectTotalItems);
  }

  get cartTotal$(): Observable<number> {
    return this.store.select(CartSelectors.selectCartTotal);
  }

  addToCart(product: ProductCartItem): void {
    this.store.dispatch(CartActions.addToCart({ product }));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  clearCart(): void {
    this.store.dispatch(CartActions.clearCart());
  }
  mapToCartItem(product: ProductDto): ProductCartItem {
  return {
    category: {
      description: product.category?.description ?? null,
      id: product.category?.id ?? undefined,
      name: product.category?.name ?? null,
    },
    categoryId: product.categoryId ?? 0,
    id: product.id ?? 0,
    name: product.name,
    price: product.price,
    stock: product.stock,
  };
}
}
