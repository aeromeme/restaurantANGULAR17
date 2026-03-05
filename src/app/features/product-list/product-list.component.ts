import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductDto } from '../../api/models';
import { ProductsService } from '../../api/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { CartItem, ProductCartItem } from '../../store/cart.state';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCartItems } from '../../store/cart.selectors';import * as CartActions from '../../store/cart.actions';
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: ProductDto[] = [];
  loading = true;
  cartItems$: Observable<CartItem[]>;

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private store: Store
  ) {
    this.cartItems$ = this.store.select(selectCartItems);
  }

  ngOnInit(): void {
    this.productsService.apiProductsGet$Json().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  addToCart(product: ProductDto): void {
    const productCartItem = this.cartService.mapToCartItem(product);
    this.cartService.addToCart(productCartItem);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  removeFromCart(productId: number): void {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }
}
