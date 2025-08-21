import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ProductsService } from './api/services';
import { ProductDto } from './api/models';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule,
    MatButtonModule,
    MatMenuModule,  // <--- must import MatMenuModule
    MatIconModule,
  RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-restaurant';
  product: ProductDto | undefined;
  constructor(private productService: ProductsService) {
    this.productService.apiProductsIdGet$Json({ id: 1 }).subscribe({
      next: (data) => {
        this.product=data;
      },
      error: (error) => {
        console.error('Error fetching product:', error);
      }
    });
  }
}
