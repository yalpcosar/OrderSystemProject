import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Customer } from '../../../../models/customer.model';
import { Customer as CustomerDto } from '../models/Customer';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private httpClient: HttpClient) { }

  getCustomerList(): Observable<Customer[]> {
    return this.httpClient.get<CustomerDto[]>(environment.getApiUrl + '/customers/')
      .pipe(
        map(customers => customers.map(customer => this.mapCustomerDtoToCustomer(customer)))
      );
  }

  getCustomerById(id: number): Observable<Customer> {
    return this.httpClient.get<CustomerDto>(environment.getApiUrl + `/customers/${id}`)
      .pipe(
        map(customer => this.mapCustomerDtoToCustomer(customer))
      );
  }

  addCustomer(customer: Customer): Observable<any> {
    const customerDto = this.mapCustomerToCustomerDto(customer);
    return this.httpClient.post(environment.getApiUrl + '/customers/', customerDto, { responseType: 'text' });
  }

  updateCustomer(customer: Customer): Observable<any> {
    const customerDto = this.mapCustomerToCustomerDto(customer);
    return this.httpClient.put(environment.getApiUrl + '/customers/', customerDto, { responseType: 'text' });
  }

  deleteCustomer(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/customers/${id}`);
  }

  private mapCustomerDtoToCustomer(customerDto: CustomerDto): Customer {
    return {
      id: customerDto.customerId,
      customerName: customerDto.name,
      customerCode: customerDto.citizenId || '',
      address: customerDto.address,
      phoneNumber: customerDto.mobilePhones,
      email: '', // Not available in DTO
      createdUserId: 0,
      createdDate: new Date(),
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    };
  }

  private mapCustomerToCustomerDto(customer: Customer): CustomerDto {
    return {
      customerId: customer.id,
      citizenId: customer.customerCode,
      nationalityId: 1, // Default nationality
      name: customer.customerName,
      address: customer.address,
      mobilePhones: customer.phoneNumber
    };
  }
}

