import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { PColor } from '../models/pcolor';

@Injectable({
  providedIn: 'root'
})
export class PColorService {

  private apiUrl = environment.getApiUrl + '/pcolors/';

  constructor(private httpClient: HttpClient) { }

  getColorList(): Observable<PColor[]> {
    return this.httpClient.get<PColor[]>(this.apiUrl);
  }

  getColorById(id: number): Observable<PColor> {
    return this.httpClient.get<PColor>(this.apiUrl + id);
  }

  addColor(pColor: PColor): Observable<any> {
    return this.httpClient.post(this.apiUrl, pColor);
  }

  updateColor(pColor: PColor): Observable<any> {
    return this.httpClient.put(this.apiUrl, pColor);
  }

  deleteColor(id: number): Observable<any>{
    return this.httpClient.delete(this.apiUrl + id);
  }
}
