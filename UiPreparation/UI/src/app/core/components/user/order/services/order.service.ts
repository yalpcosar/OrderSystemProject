import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { OrderDetailDto } from '../models/order-detail-dto';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  
  private apiUrl = environment.getApiUrl + '/orders/';

  constructor(private httpClient: HttpClient) { }

  getOrderList(): Observable<OrderDetailDto[]> {
    return this.httpClient.get<OrderDetailDto[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<OrderDetailDto> {
    return this.httpClient.get<OrderDetailDto>(this.apiUrl + id);
  }

  addOrder(order: Order): Observable<any> {
    return this.httpClient.post(this.apiUrl, order);
  }

  updateOrder(order: Order): Observable<any> {
    return this.httpClient.put(this.apiUrl, order);
  }

  deleteOrder(id: number): Observable<any> {
    return this.httpClient.delete(this.apiUrl + id);
  }
}
