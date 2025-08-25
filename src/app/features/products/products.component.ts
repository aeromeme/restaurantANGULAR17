import { Component, OnInit } from '@angular/core';
import { ProductDto, CategoryDto } from '../../api/models';

import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../api/services/category.service';
import { ProductsService } from '../../api/services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  products: ProductDto[] = [];
  categories: CategoryDto[] = []; // <-- Add this property
  columns: string[] = ['name', 'price', 'stock', 'category', 'actions'];
  loading = true;

  constructor(
    private productsService: ProductsService,
    private categoryService: CategoryService, // <-- Inject CategoryService
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Load products
    //this.productsService.getProducts().subscribe({
    this.productsService.apiProductsGet$Json().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });

    // Load categories
    this.categoryService.apiCategoryGet$Json().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Failed to load categories', err);
      },
    });
  }
  openProductPopup(): void {
    const dialogRef = this.dialog.open(ProductEditorComponent, {
      width: '400px', // 👈 fixed width
      disableClose: true, // optional: prevent closing on backdrop click
      maxHeight: '90vh', // maximum height relative to viewport
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // only add if result is defined and is a new product

        //this.productsService.createProduct(result ).subscribe({
        this.productsService.apiProductsPost$Json({ body: result }).subscribe({
          next: (createdProduct: ProductDto) => {
            // Success: add to local list
            this.products = [...this.products, createdProduct];
            console.log('Product created:', createdProduct);
          },
          error: (err) => {
            // Handle errors safely
            console.error('Failed to create product:', err);
            alert('Could not create product. Please try again.');
          },
        });
      }
    });
  }
  editProduct(product: ProductDto): void {
    const dialogRef = this.dialog.open(ProductEditorComponent, {
      width: '400px',
      disableClose: true,
      maxHeight: '90vh',
      data: { product },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.id) {
        this.productsService
          //.updateProduct( result)
          .apiProductsIdPut$Json({ id: result.id, body: result })
          .subscribe({
            next: (updatedProduct: ProductDto) => {
              this.products = this.products.map((p) =>
                p.id === updatedProduct.id ? updatedProduct : p
              );
            },
            error: (err) => {
              alert('Failed to update product.');
              console.error(err);
            },
          });
      }
    });
  }

  deleteProduct(product: ProductDto): void {
    if (confirm(`Delete product "${product.name}"?`)) {
      this.productsService.apiProductsIdDelete({ id: product.id! }).subscribe({
      //  this.productsService.deleteProduct( product.id!).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p.id !== product.id);
        },
        error: (err) => {
          alert('Failed to delete product.');
          console.error(err);
        },
      });
    }
  }
}
