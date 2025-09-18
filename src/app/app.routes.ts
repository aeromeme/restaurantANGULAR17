import { Routes } from '@angular/router';
import { CategoriesComponent } from './features/categories/categories.component';
import { ProductsComponent } from './features/products/products.component';
import { OrdersListComponent } from './features/orders/orders-list.component';
import { OrderCreateComponent } from './features/orders/create/order-create.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './core/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrdersListComponent, canActivate: [authGuard] },
  { path: 'orders/create', component: OrderCreateComponent, canActivate: [authGuard]}, // <-- Flat route
  { path: 'login', component: LoginComponent },
];
