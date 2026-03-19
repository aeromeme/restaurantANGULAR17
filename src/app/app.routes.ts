import { Routes } from '@angular/router';
import { CategoriesComponent } from './features/categories/categories.component';
import { ProductsComponent } from './features/products/products.component';
import { OrdersListComponent } from './features/orders/orders-list.component';
import { OrderCreateComponent } from './features/orders/create/order-create.component';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { ProductListComponent } from './features/product-list/product-list.component';
import { CartComponent } from './features/cart/cart.component';
import { SignalsampleComponent } from './features/signalsample/signalsample.component';
import { FanRegistrationComponent } from './features/fan-registration/fan-registration.component';

export const routes: Routes = [
  { path: '', redirectTo: 'product-list', pathMatch: 'full' },
  {
    path: 'product-list',
    component: ProductListComponent,
    canActivate: [authGuard],
  },
  { path: 'products', component: ProductsComponent, canActivate: [authGuard] },
  {
    path: 'categories',
    component: CategoriesComponent,
    canActivate: [authGuard],
  },
  { path: 'orders', component: OrdersListComponent, canActivate: [authGuard] },
  {
    path: 'orders/create',
    component: OrderCreateComponent,
    canActivate: [authGuard],
  }, // <-- Flat route
  { path: 'cart', component: CartComponent, canActivate: [authGuard] },
  {
    path: 'signalsample',
    component: SignalsampleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'fan-registration',
    component: FanRegistrationComponent,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
];
