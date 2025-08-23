import { Routes } from '@angular/router';
import { CategoriesComponent } from './features/categories/categories.component';
import { ProductsComponent } from './features/products/products.component';
import { OrdersListComponent } from './features/orders/orders-list.component';
import { OrderCreateComponent } from './features/orders/create/order-create.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent },
  { path: 'orders', component: OrdersListComponent },
  { path: 'orders/create', component: OrderCreateComponent }, // <-- Flat route
];
