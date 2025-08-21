import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import {
  CreateProductDto,
  UpdateProductDto,
  CategoryDto,
} from '../../../api/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CategoryService } from '../../../api/services/category.service'; // <-- Import service
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-editor',
  standalone: true,
  imports: [
    CommonModule, // <-- Add this line
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, // <-- Add this line
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.css',
})
export class ProductEditorComponent {
  createProduct: CreateProductDto | undefined;
  updateProduct: UpdateProductDto | undefined;
  productForm: FormGroup;
  categories: CategoryDto[] = [];
  isEditMode = false;

  constructor(
    public dialogRef: MatDialogRef<ProductEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private categoryService: CategoryService // <-- Inject service
  ) {
    this.productForm = this.fb.group({
      id: [null], // Add id for update
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
    });

    // Load categories from service
    this.categoryService.apiCategoryGet$Json().subscribe({
      next: (cats) => (this.categories = cats),
      error: (err) => {
        console.error('Failed to load categories', err);
        this.categories = [];
      },
    });

    // If editing, patch form with product data
    if (data && data.product) {
      this.isEditMode = true;
      this.productForm.patchValue({
        id: data.product.id,
        name: data.product.name,
        price: data.product.price,
        categoryId: data.product.category?.id,
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      this.dialogRef.close(this.productForm.value);
    }
  }

  onCancel(): void {
    this.productForm.reset();
    this.dialogRef.close();
  }
}
