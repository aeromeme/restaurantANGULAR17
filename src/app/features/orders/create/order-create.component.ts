import { Component, OnInit } from '@angular/core';
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
  OrderDto,
} from '../../../api/models';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DetailEditorComponent } from './detail-editor/detail-editor.component';
import { Router, ActivatedRoute } from '@angular/router';

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
export class OrderCreateComponent implements OnInit {
  orderDetails: OrderDetailDto[] = [];
  isEditMode = false; // <-- Add this

  orderForm = this.fb.group({
    customerName: [''],
    orderDate: [new Date().toISOString().substring(0, 10)], // yyyy-MM-dd for input[type="date"]
    totalAmount: [0],
    // orderDetails is not a form control, but managed as a property
  });

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private dialog: MatDialog,
    private router: Router, // <-- Add this
    private route: ActivatedRoute // <-- Add this
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const orderId = params['id'];
      if (orderId) {
        console.log('Edit mode for order ID:', orderId);
        this.isEditMode = true; // <-- Set edit mode
        this.orderService.apiOrderIdGet$Json({ id: orderId }).subscribe((order) => {
          console.log('Fetched order:', order);
          this.orderForm.patchValue({
            customerName: order.customerName,
            orderDate: order.orderDate,
            totalAmount: order.totalAmount,
          });
          this.orderDetails = [...(order.orderDetails || [])];
        });
      }
    });
  }

  onSubmit() {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;

      if (this.isEditMode) {
        const orderIdParam = this.route.snapshot.queryParamMap.get('id');
        const UpdateOrderDto: OrderDto = {
          orderId: orderIdParam ? Number(orderIdParam) : 0,
          customerName: formValue.customerName ?? '',
          orderDate: formValue.orderDate ?? '',
          orderDetails: this.orderDetails.length ? this.orderDetails : null,
        };
        // Get the order ID from query params

        const orderId = orderIdParam !== null ? Number(orderIdParam) : null;
        if (orderId !== null && !isNaN(orderId)) {
          this.orderService
            .apiOrderIdPut({ id: orderId, body: UpdateOrderDto })
            .subscribe({
              next: () => {
                this.router.navigate(['/orders']);
              },
              error: (err) => {
                // handle error
              },
            });
        } else {
          // handle invalid orderId, e.g., show an error message
        }
      } else {
        const createOrderDto: CreateOrderDto = {
          customerName: formValue.customerName ?? '',
          orderDate: formValue.orderDate ?? '',
          orderDetails: this.orderDetails.length ? this.orderDetails : null,
        };
        this.orderService
          .apiOrderPost$Json({ body: createOrderDto })
          .subscribe({
            next: () => {
              this.router.navigate(['/orders']);
            },
            error: (err) => {
              // handle error
            },
          });
      }
    }
  }
  removeItem(item: OrderDetailDto) {
    this.orderDetails = this.orderDetails.filter(
      (d) => d.productId !== item.productId
    );
    // Update totalAmount after removal
    this.orderForm.patchValue({
      totalAmount: this.orderDetails.reduce(
        (sum, d) =>
          sum + ((d as any).amount ?? d.quantity * (d as any).unitPrice),
        0
      ),
    });
  }

  openDetailDialog() {
    const dialogRef = this.dialog.open(DetailEditorComponent, {
      width: '400px',
    });

    dialogRef.componentInstance.addDetail.subscribe(
      (detail: CreateOrderDetailDto) => {
        const existing = this.orderDetails.find(
          (d) => d.productId === detail.productId
        );
        if (existing) {
          this.orderDetails = this.orderDetails.map((d) =>
            d.productId === detail.productId
              ? {
                  ...d,
                  quantity: d.quantity + detail.quantity,
                  amount: (d.quantity + detail.quantity) * (d as any).unitPrice,
                }
              : d
          );
        } else {
          (detail as any).amount = detail.quantity * (detail as any).unitPrice;
          this.orderDetails = [...this.orderDetails, detail];
        }
        // Optionally update totalAmount here
        this.orderForm.patchValue({
          totalAmount: this.orderDetails.reduce(
            (sum, d) =>
              sum + ((d as any).amount ?? d.quantity * (d as any).unitPrice),
            0
          ),
        });
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      // Dialog closed, do any cleanup if needed
    });
  }
}
