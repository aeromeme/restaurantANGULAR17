import { ProductDto } from '../api/models';

export interface CategoryCartItem {
  description?: string | null;
  id?: number;
  name?: string | null;
}
export interface ProductCartItem {
  category: CategoryCartItem;
  categoryId: number;
  id: number;
  name: string;
  price: number;
  stock?: number;
}
export interface CartItem {
  product: ProductCartItem;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}