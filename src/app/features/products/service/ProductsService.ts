// src/app/services/products.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductDto } from '../../../api/models/product-dto';



@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly baseUrl = 'http://localhost:5072/api/Products';

  constructor(private readonly http: HttpClient) {}

  getProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(this.baseUrl);
  }

  getProduct(id: number): Observable<ProductDto> {
    return this.http.get<ProductDto>(`${this.baseUrl}/${id}`);
  }

  createProduct(
    product: Omit<ProductDto, 'id'>
  ): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl, product);
  }

  updateProduct(product: ProductDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
