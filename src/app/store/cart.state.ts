import { ProductDto } from '../api/models';

export interface CartItem {
  product: ProductDto;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export interface AppState {
  cart: CartState;
}