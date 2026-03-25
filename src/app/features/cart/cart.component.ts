import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../store/cart.state';
import { selectCartItems, selectCartTotal } from '../../store/cart.selectors';
import * as CartActions from '../../store/cart.actions';
import { FavoritesStore } from '../../store/favorites.signal-store';
import pdfMake from 'pdfmake/build/pdfmake';
import  pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';


@Component({
  selector: 'app-cart',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private store = inject(Store);
  private favoritesStore = inject(FavoritesStore);
  cartItems$: Observable<CartItem[]> = this.store.select(selectCartItems);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);

  constructor() {
    pdfMake.addVirtualFileSystem(pdfFonts);
  }

  updateQuantity(productId: number, quantity: number) {
    this.store.dispatch(CartActions.updateQuantity({ productId, quantity }));
  }

  removeFromCart(productId: number) {
    this.store.dispatch(CartActions.removeFromCart({ productId }));
  }

  clearCart() {
    this.store.dispatch(CartActions.clearCart());
  }

  isFavorite(productId: number) {
    return this.favoritesStore.isFavorite(productId);
  }

  exportCartToPDF() {
    this.exportHtmlToPdf('cart', 'cart.pdf');
  }

   exportHtmlToPdf(elementId: string, fileName: string = 'export.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }

    const htmlContent = element.innerHTML;
    const pdfContent = htmlToPdfmake(htmlContent);  // Convert HTML to pdfmake format

    const docDefinition = {
      content: pdfContent
    };

    pdfMake.createPdf(docDefinition).download(fileName);
  }
}
