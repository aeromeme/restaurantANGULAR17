import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { OrderService } from '../../api/services/order.service';
import { OrderDto } from '../../api/models';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

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
    MatPaginatorModule,
  ],
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
})
export class OrdersListComponent implements OnInit {
  orders: OrderDto[] = [];
  dataSource = new MatTableDataSource<OrderDto>([]);
  columns: string[] = ['actions', 'id', 'customer', 'date', 'total'];
  expandedOrder: OrderDto | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private ordersService: OrderService) {}

  ngOnInit(): void {
    this.ordersService.apiOrderGet$Json().subscribe({
      next: (data) => {
        this.orders = data;
        this.dataSource.data = data;
      },
      error: (err) => console.error('Failed to load orders', err),
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  deleteOrder(order: OrderDto) {
    if (confirm('Are you sure you want to delete this order?')) {
      if (order.orderId !== undefined) {
        this.ordersService
          .apiOrderIdDelete({ id: order.orderId })
          .subscribe(() => {
            this.orders = this.orders.filter(
              (o) => o.orderId !== order.orderId
            );
          });
      } else {
        console.error('Order ID is undefined. Cannot delete order.');
      }
    }
  }
}
