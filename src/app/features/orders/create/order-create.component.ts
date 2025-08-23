import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { OrderService } from '../../../api/services/order.service';
// Update the path below to the correct location of create-order-detail-dto
import {
  OrderDetailDto,
  CreateOrderDetailDto,
  CreateOrderDto,
} from '../../../api/models';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DetailEditorComponent } from './detail-editor/detail-editor.component';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './order-create.component.html',
  styleUrl: './order-create.component.css',
})
export class OrderCreateComponent {
  orderDetails: OrderDetailDto[] = [];

  orderForm = this.fb.group({
    customerName: [''],
    orderDate: [new Date().toISOString().substring(0, 10)], // yyyy-MM-dd for input[type="date"]
    totalAmount: [0],
    // orderDetails is not a form control, but managed as a property
  });

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialog: MatDialog
  ) {}

  onSubmit() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      const createOrderDto: CreateOrderDto = {
        customerName: formValue.customerName ?? '',
        orderDate: formValue.orderDate ?? '',
        orderDetails: this.orderDetails.length ? this.orderDetails : null,
      };
      this.orderService.apiOrderPost$Json({ body: createOrderDto }).subscribe({
        next: () => {
          // handle success (e.g., navigate, show message)
        },
        error: (err) => {
          // handle error
        },
      });
    }
  }
  removeItem(item: OrderDetailDto) {}

  openDetailDialog() {
    const dialogRef = this.dialog.open(DetailEditorComponent, {
      width: '400px',
    });

    // Listen for addDetail events
    dialogRef.componentInstance.addDetail.subscribe(
      (detail: OrderDetailDto) => {
        this.orderDetails.push(detail);
        // Optionally update totalAmount here
      }
    );

    // Optionally handle dialog close if needed
    dialogRef.afterClosed().subscribe(() => {
      // Dialog closed, do any cleanup if needed
    });
  }
}
