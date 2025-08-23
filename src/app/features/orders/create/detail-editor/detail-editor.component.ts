import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../../products/service/ProductsService'; // Adjust path as needed
import { OrderDetailDto, ProductDto } from '../../../../api/models';
import { MatSelectModule } from '@angular/material/select';
import { CreateOrderDetailDto } from '../../../../api/models/create-order-detail-dto'; // Adjust path if needed
// Update the path below to the correct location of ProductDto
// TODO: Adjust the path below if ProductDto is located elsewhere

@Component({
  selector: 'app-detail-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogActions,
    MatSelectModule, // <-- Add this line
  ],
  templateUrl: './detail-editor.component.html',
  styleUrl: './detail-editor.component.css',
})
export class DetailEditorComponent implements OnInit {
  @Output() addDetail = new EventEmitter<any>();
  detailForm: FormGroup;
  products: ProductDto[] = [];

  constructor(
    public dialogRef: MatDialogRef<DetailEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private productsService: ProductsService
  ) {
    this.detailForm = this.fb.group({
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });

    // Load products
    this.productsService.getProducts().subscribe({
      next: (products) => (this.products = products),
      error: (err) => console.error('Failed to load products', err),
    });

    if (data?.item) {
      this.detailForm.patchValue(data.item);
    }
  }

  ngOnInit() {
    this.detailForm.get('productId')?.valueChanges.subscribe((productId) => {
      const selectedProduct = this.products.find((p) => p.id === productId);
      if (selectedProduct) {
        this.detailForm.patchValue({ unitPrice: selectedProduct.price });
      }
    });
  }

  addAndReset() {
    if (this.detailForm.valid) {
      const formValue = this.detailForm.value;
      const orderDetail: OrderDetailDto = {
        productId: formValue.productId,
        quantity: formValue.quantity,
        unitPrice: formValue.unitPrice,
        product: this.products.find((p) => p.id === formValue.productId),
      };
      this.addDetail.emit(orderDetail); // Emit only the required fields
      this.detailForm.reset({
        productId: '',
        quantity: 1,
      });
    }
  }

  onDone() {
    this.dialogRef.close();
  }
}
