import { signalStore, withState, withMethods, patchState, withComputed } from '@ngrx/signals';
import { withStorageSync } from '@angular-architects/ngrx-toolkit';
import { computed } from '@angular/core';

export interface CategoryFavoriteItem {
  description?: string | null;
  id?: number;
  name?: string | null;
}
export interface ProductFavoriteItem {
  category: CategoryFavoriteItem;
  categoryId: number;
  id: number;
  name: string;
  price: number;
  stock?: number;
}
export interface FavoritesState {
  items: ProductFavoriteItem[];
}

export const FavoritesStore = signalStore(
  { providedIn: 'root' },
  withState<FavoritesState>({ items: [] }),
  withStorageSync('favorites'), //
  withMethods((store: any) => ({
    addToFavorites(product: ProductFavoriteItem) {
      const currentItems = store.items();
      const exists = currentItems.find((item: ProductFavoriteItem) => item.id === product.id);
      if (!exists) {
        patchState(store, { items: [...currentItems, product] });
      }
    },
    removeFromFavorites(productId: number) {
      const currentItems = store.items();
      patchState(store, { items: currentItems.filter((item: ProductFavoriteItem) => item.id !== productId) });
    },
    clearFavorites() {
      patchState(store, { items: [] });
    },
    isFavorite: (productId: number) => computed(() => store.items().some((item: ProductFavoriteItem) => item.id === productId)),
  })),
  withComputed((store: any) => ({
    count: computed(() => store.items().length),
  }))
);