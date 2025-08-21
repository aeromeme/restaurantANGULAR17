import { Routes } from '@angular/router';
import { CategoriesComponent } from './features/categories/categories.component';
import { ProductsComponent } from './features/products/products.component';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent },
  { path: 'categories', component: CategoriesComponent }
];
