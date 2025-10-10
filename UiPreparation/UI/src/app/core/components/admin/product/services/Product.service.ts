import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Product } from '../models/Product';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClient: HttpClient) { }

  getProductList(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(environment.getApiUrl + '/products/');
  }

  getProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(environment.getApiUrl + `/products/${id}`);
  }

  addProduct(product: Product): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + '/products/', product, { responseType: 'text' });
    return result;
  }

  updateProduct(product: Product): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + '/products/', product, { responseType: 'text' });
    return result;
  }

  deleteProduct(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/products/${id}`);
  }

  getProductsWithStock(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(environment.getApiUrl + '/products/with-stock');
  }
}

