import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../store/cart.state';
import { selectCartItems, selectCartTotal } from '../../store/cart.selectors';
import * as CartActions from '../../store/cart.actions';

@Component({
  selector: 'app-cart-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './cart-dialog.component.html',
  styleUrl: './cart-dialog.component.css',
})
export class CartDialogComponent {
  cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);

  constructor(
    private store: Store,
    public dialogRef: MatDialogRef<CartDialogComponent>,
  ) {}

  updateQuantity(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  removeFromCart(productId: number) {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart() {
    this.store.dispatch(CartActions.clearCart());
  }

  close(): void {
    this.dialogRef.close();
  }
}
