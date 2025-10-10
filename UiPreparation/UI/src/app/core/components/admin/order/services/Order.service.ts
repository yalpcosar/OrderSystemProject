import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Order } from '../models/Order';
import { OrderDto } from '../models/OrderDto';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClient: HttpClient) { }

  getOrderList(): Observable<OrderDto[]> {
    return this.httpClient.get<OrderDto[]>(environment.getApiUrl + '/orders/dto');
  }

  getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(environment.getApiUrl + `/orders/${id}`);
  }

  addOrder(order: Order): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + '/orders/', order, { responseType: 'text' });
    return result;
  }

  updateOrder(order: Order): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + '/orders/', order, { responseType: 'text' });
    return result;
  }

  deleteOrder(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/orders/${id}`);
  }

  getOrderReport(startDate?: string, endDate?: string): Observable<any> {
    let url = environment.getApiUrl + '/orders/report';
    const params: string[] = [];

    if (startDate) {
      params.push(`startDate=${startDate}`);
    }
    if (endDate) {
      params.push(`endDate=${endDate}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    return this.httpClient.get<any>(url);
  }
}

