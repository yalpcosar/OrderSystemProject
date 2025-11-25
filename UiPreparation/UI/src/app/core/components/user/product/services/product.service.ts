import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { ProductDetailDto } from '../models/product-detail-dto';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.getApiUrl + '/products/'

  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<ProductDetailDto[]> {
    return this.httpClient.get<ProductDetailDto[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<ProductDetailDto> {
    return this.httpClient.get<ProductDetailDto>(this.apiUrl + id);
  }

  addProduct(product: Product): Observable<any> {
    return this.httpClient.post(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.httpClient.put(this.apiUrl, product);
  }

  deleteProduct(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + id);
  }
}
