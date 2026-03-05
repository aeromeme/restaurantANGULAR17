import { Component, inject } from '@angular/core';
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


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'my-restaurant';
  product: ProductDto | undefined;
  totalItems$: Observable<number>;
  jwtStorage = inject(JwtStorageService);
  cartService = inject(CartService);
  router = inject(Router);
  productService = inject(ProductsService);

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

  get isLoggedIn(): boolean {
    return this.jwtStorage.isAuthenticated();
  }

  logout() {
    this.jwtStorage.removeToken();
    this.router.navigate(['/login']);
  }
}
