import { Injectable } from '@angular/core';
import { Forecast } from './city/data';
import { Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class ForecastValuesService {

  forecastValues = Array<Forecast>();
  updated = new Subject();

  getUpdates(): Observable<Array<Forecast>>{
    return <Observable<Array<Forecast>>> this.updated.asObservable();
  }

  setValues(values: Array<Forecast>) {
    this.forecastValues = values;
    this.updated.next(this.forecastValues);
  }

  getValues(): Array<Forecast> {
    return this.forecastValues;
  }
  constructor() { }
}

//Simply stores and shares updates of the forecast values used in the current moment in the application
 