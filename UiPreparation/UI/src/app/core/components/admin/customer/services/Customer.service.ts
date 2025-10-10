import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Customer } from '../models/Customer';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  getCustomerList(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>(environment.getApiUrl + '/customers/');
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<Customer>(environment.getApiUrl + `/customers/${id}`);
  }

  addCustomer(customer: Customer): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + '/customers/', customer, { responseType: 'text' });
    return result;
  }

  updateCustomer(customer: Customer): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + '/customers/', customer, { responseType: 'text' });
    return result;
  }

  deleteCustomer(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/customers/${id}`);
  }
}

