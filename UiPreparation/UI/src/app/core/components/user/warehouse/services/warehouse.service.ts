import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { WarehouseReportDto } from '../models/warehouse-report-dto';
import { WarehouseItemDto } from '../models/warehouse-item-dto';
import { Warehouse } from '../models/warehouse';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  private apiUrl = environment.getApiUrl + '/warehouse/'

  constructor(private httpClient: HttpClient) { }

  getWarehouseItemList(): Observable<WarehouseReportDto>{
    return this.httpClient.get<WarehouseReportDto>(this.apiUrl);
  }

  getWarehouseItemById(id: number): Observable<WarehouseItemDto>{
    return this.httpClient.get<WarehouseItemDto>(this.apiUrl + id);
  }

  updateWarehouseItem(warehouse: Warehouse): Observable<any>{
    return this.httpClient.put(this.apiUrl, warehouse);
  }
}
