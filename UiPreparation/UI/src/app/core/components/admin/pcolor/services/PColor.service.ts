import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { PColor } from '../models/PColor';


@Injectable({
  providedIn: 'root'
})
export class PColorService {

  constructor(private httpClient: HttpClient) { }

  getColorList(): Observable<PColor[]> {
    return this.httpClient.get<PColor[]>(environment.getApiUrl + '/pcolors/');
  }

  getColorById(id: number): Observable<PColor> {
    return this.httpClient.get<PColor>(environment.getApiUrl + `/pcolors/${id}`);
  }

  addColor(color: PColor): Observable<any> {
    var result = this.httpClient.post(environment.getApiUrl + '/pcolors/', color, { responseType: 'text' });
    return result;
  }

  updateColor(color: PColor): Observable<any> {
    var result = this.httpClient.put(environment.getApiUrl + '/pcolors/', color, { responseType: 'text' });
    return result;
  }

  deleteColor(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/pcolors/${id}`);
  }
}

