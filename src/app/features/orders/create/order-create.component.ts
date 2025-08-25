import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

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
    MatCardModule,
    MatIcon,
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
    private route: ActivatedRoute, // <-- Add this
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const orderId = params['id'];
      if (orderId) {
        console.log('Edit mode for order ID:', orderId);
        this.isEditMode = true; // <-- Set edit mode
        this.orderService
          .apiOrderIdGet$Json({ id: orderId })
          .subscribe((order) => {
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
    const formValue = this.orderForm.value;
    console.log('Form Value:', formValue);
    console.log('Edit Mode:', this.isEditMode);
    if (this.orderForm.valid) {
      console.log('Form Value:', formValue);
      console.log('Edit Mode:', this.isEditMode);
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
         console.log('Updating order:', UpdateOrderDto);
        console.log('Order ID:', orderId);
        if (orderId !== null && !isNaN(orderId)) {
          this.orderService
            .apiOrderIdPut$Json({ id: orderId, body: UpdateOrderDto })
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
      (d) => d.orderDetailId !== item.orderDetailId
    );
    // Update totalAmount after removal
    this.updateTotalAmount();
  }

  openDetailDialog(item?: OrderDetailDto) {
    const dialogRef = this.dialog.open(DetailEditorComponent, {
      width: '400px',
      data: { item },
    });

    dialogRef.componentInstance.addDetail.subscribe(
      (detail: CreateOrderDetailDto & { unitPrice?: number }) => {
        const existing = this.orderDetails.find(
          (d) => d.productId === detail.productId
        );
        if (item) {
          // Edit mode: check if productId has changed
          if (item.productId !== detail.productId) {
            const existing = this.orderDetails.find(
              (d) => d.productId === detail.productId
            );
            if (existing) {
              // Product changed and new product already exists: sum quantities and update amount, remove original item
              this.orderDetails = this.orderDetails
                .filter((d) => d.productId !== item.productId) // remove the original item
                .map((d) =>
                  d.productId === detail.productId
                    ? {
                        ...d,
                        quantity: d.quantity + detail.quantity,
                        amount:
                          (d.quantity + detail.quantity) *
                          (detail.unitPrice ?? (d as any).unitPrice ?? 0),
                        unitPrice: detail.unitPrice ?? (d as any).unitPrice,
                      }
                    : d
                );
            } else {
              // Product changed and new product does not exist: update the item
              this.orderDetails = this.orderDetails.map((d) =>
                d.productId === item.productId
                  ? {
                      ...d,
                      ...detail,
                      amount: detail.quantity * (detail.unitPrice ?? 0),
                    }
                  : d
              );
            }
          } else {
            // Product not changed: just update the item
            this.orderDetails = this.orderDetails.map((d) =>
              d.productId === item.productId
                ? {
                    ...d,
                    ...detail,
                    amount: detail.quantity * (detail.unitPrice ?? 0),
                  }
                : d
            );
          }
        } else if (existing) {
          // Add mode, but product already exists: increment quantity and update amount
          this.orderDetails = this.orderDetails.map((d) =>
            d.productId === detail.productId
              ? {
                  ...d,
                  quantity: d.quantity + detail.quantity,
                  amount:
                    (d.quantity + detail.quantity) *
                    (detail.unitPrice ?? (d as any).unitPrice ?? 0),
                  unitPrice: detail.unitPrice ?? (d as any).unitPrice,
                }
              : d
          );
        } else {
          // Add mode, new product: add new detail
          (detail as any).amount = detail.quantity * (detail.unitPrice ?? 0);
          this.orderDetails = [...this.orderDetails, detail];
        }
        this.updateTotalAmount();
      }
    );

    dialogRef.afterClosed().subscribe(() => {
      // Dialog closed, do any cleanup if needed
    });
  }
  onCancel() {
    this.router.navigate(['/orders']);
  }

  private updateTotalAmount() {
    this.orderForm.patchValue({
      totalAmount: this.orderDetails.reduce(
        (sum, d) =>
          sum + Number(d.quantity || 0) * Number((d as any).unitPrice || 0),
        0
      ),
    });
    this.cdr.markForCheck();
  }
}
