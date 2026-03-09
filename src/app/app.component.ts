import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductsService } from './api/services';
import { ProductDto } from './api/models';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { JwtStorageService } from './core/services/jwt-storage.service';
import { CartService } from './core/services/cart.service';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CartDialogComponent } from './features/cart-dialog/cart-dialog.component';
import { Store } from '@ngrx/store';
import * as CartActions from './store/cart.actions';
import { FavoritesStore } from './store/favorites.signal-store';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'my-restaurant';
  product: ProductDto | undefined;
  totalItems$: Observable<number>;
  jwtStorage = inject(JwtStorageService);
  cartService = inject(CartService);
  router = inject(Router);
  productService = inject(ProductsService);
  dialog = inject(MatDialog);
  store = inject(Store);
  favoritesStore = inject(FavoritesStore);
  constructor() {
    this.productService.apiProductsIdGet$Json({ id: 1 }).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      },
    });
    this.totalItems$ = this.cartService.totalItems$;
  }

  ngOnInit(): void {
    // Clear cart if user is not authenticated on app startup
    if (!this.jwtStorage.isAuthenticated()) {
      this.cartService.clearCart();
    }
  }

  openCartDialog() {
    this.dialog.open(CartDialogComponent, { width: '400px' });
  }

  get isLoggedIn(): boolean {
    return this.jwtStorage.isAuthenticated();
  }

  logout() {
    this.jwtStorage.removeToken();
    this.store.dispatch(CartActions.clearCart());
    this.favoritesStore.clearFavorites();
    this.router.navigate(['/login']);
  }
}
