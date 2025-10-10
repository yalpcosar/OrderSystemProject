import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { Warehouse } from '../models/Warehouse';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private httpClient: HttpClient) { }

  getWarehouseList(): Observable<Warehouse[]> {
    return this.httpClient.get<Warehouse[]>(environment.getApiUrl + '/warehouses/');
  }

  getWarehouseById(id: number): Observable<Warehouse> {
    return this.httpClient.get<Warehouse>(environment.getApiUrl + `/warehouses/${id}`);
  }

  addWarehouse(warehouse: Warehouse): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + '/warehouses/', warehouse, { responseType: 'text' });
    return result;
  }

  updateWarehouse(warehouse: Warehouse): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + '/warehouses/', warehouse, { responseType: 'text' });
    return result;
  }

  deleteWarehouse(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/warehouses/${id}`);
  }

  getWarehouseReport(): Observable<any> {
    return this.httpClient.get<any>(environment.getApiUrl + '/warehouses/report');
  }

  checkAvailability(productId: number, quantity: number): Observable<any> {
    return this.httpClient.get<any>(
      environment.getApiUrl + `/warehouses/check-availability?productId=${productId}&quantity=${quantity}`
    );
  }
}

