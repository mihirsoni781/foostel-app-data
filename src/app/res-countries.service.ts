import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { JsonPipe } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ResCountriesService {
  constructor( private _http: HttpClient) { }
  prefix = ''
  getCurrency(code){
    return<any> this._http.get(`${this.prefix}/api/getCurrency/${code}`);
  }
}
