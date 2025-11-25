import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl = environment.getApiUrl + '/customers/';

  constructor(private httpClient: HttpClient) {}

  getCustomerList(): Observable<Customer[]>{
    return this.httpClient.get<Customer[]>(this.apiUrl);
  }

  getCustomerById(id: number): Observable<Customer>{
    return this.httpClient.get<Customer>(this.apiUrl + id);
  }

  addCustomer(customer: Customer): Observable<any>{
    return this.httpClient.post(this.apiUrl, customer);
  }

  updateCustomer(customer: Customer): Observable<any>{
    return this.httpClient.put(this.apiUrl, customer);
  }

  deleteCustomer(id: number): Observable<any>{
    return this.httpClient.delete(this.apiUrl + id)
  }
}
