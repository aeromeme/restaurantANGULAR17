import { Component, OnInit } from '@angular/core';
import { ProductDto, CategoryDto } from '../../api/models';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
    private dialog: MatDialog,
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
                p.id === updatedProduct.id ? updatedProduct : p,
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
  exportToExcel() {
    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.products);
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // const excelBuffer: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(blob, 'table-data.xlsx');
    const table = document.getElementById('productsTable') as HTMLTableElement;
    if (!table) {
      console.error('Table not found');
      return;
    }

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table);

     // Find column index by header (case-sensitive)
      const excludeHeader = 'Actions';  // Change to your header text
      const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
      let excludeColIndex = -1;
      for (let col = range.s.c; col <= range.e.c; ++col) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });  // Row 0 is headers
        const cell = ws[cellAddress];
        if (cell && cell.v === excludeHeader) {
          excludeColIndex = col;
          break;
        }
      }

      if (excludeColIndex !== -1) {
        // Exclude the found column
        for (let row = range.s.r; row <= range.e.r; ++row) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: excludeColIndex });
          delete ws[cellAddress];
        }
        if (range.e.c >= excludeColIndex) {
          range.e.c--;
        }
        ws['!ref'] = XLSX.utils.encode_range(range);
      }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    const excelBuffer: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  }
}
