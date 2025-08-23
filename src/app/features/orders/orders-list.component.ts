import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../../api/services/order.service';
import { OrderDto } from '../../api/models';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent implements OnInit {
  orders: OrderDto[] = [];
  columns: string[] = ['actions', 'id', 'customer', 'date', 'total'];
  expandedOrder: OrderDto | null = null;

  constructor(private ordersService: OrderService) {}

  ngOnInit(): void {
    this.ordersService.apiOrderGet$Json().subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Failed to load orders', err),
    });
  }

  deleteOrder(order: OrderDto) {
    if (confirm('Are you sure you want to delete this order?')) {
      if (order.orderId !== undefined) {
        this.ordersService.apiOrderIdDelete({ id: order.orderId }).subscribe(() => {
          this.orders = this.orders.filter((o) => o.orderId !== order.orderId);
        });
      } else {
        console.error('Order ID is undefined. Cannot delete order.');
      }
    }
  }
}
