import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { Color } from '../../../../models/color.model';
import { PColor } from '../models/PColor';


@Injectable({
  providedIn: 'root'
})
export class PColorService {

  constructor(private httpClient: HttpClient) { }

  getColorList(): Observable<Color[]> {
    return this.httpClient.get<PColor[]>(environment.getApiUrl + '/pcolors/')
      .pipe(
        map(pcolors => pcolors.map(pcolor => this.mapPColorToColor(pcolor)))
      );
  }

  getColorById(id: number): Observable<Color> {
    return this.httpClient.get<PColor>(environment.getApiUrl + `/pcolors/${id}`)
      .pipe(
        map(pcolor => this.mapPColorToColor(pcolor))
      );
  }

  addColor(color: Color): Observable<any> {
    const pcolor = this.mapColorToPColor(color);
    var result = this.httpClient.post(environment.getApiUrl + '/pcolors/', pcolor, { responseType: 'text' });
    return result;
  }

  updateColor(color: Color): Observable<any> {
    const pcolor = this.mapColorToPColor(color);
    var result = this.httpClient.put(environment.getApiUrl + '/pcolors/', pcolor, { responseType: 'text' });
    return result;
  }

  private mapPColorToColor(pcolor: PColor): Color {
    return {
      id: pcolor.id,
      name: pcolor.name,
      hexCode: pcolor.code,
      createdUserId: 0,
      createdDate: new Date(),
      lastUpdatedUserId: 0,
      lastUpdatedDate: new Date(),
      status: true,
      isDeleted: false
    };
  }

  private mapColorToPColor(color: Color): PColor {
    return {
      id: color.id,
      name: color.name,
      code: color.hexCode
    };
  }

  deleteColor(id: number): Observable<any> {
    return this.httpClient.request('delete', environment.getApiUrl + `/pcolors/${id}`);
  }
}

