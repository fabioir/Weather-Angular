import { Injectable } from '@angular/core';
import { Forecast } from './city/data';
import { Observable, Subject } from 'rxjs';
import { SavedCity } from './savedCity';

@Injectable({
  providedIn: 'root'
})
export class ForecastValuesService {

  forecastValues = Array<Forecast>();
  updated = new Subject();
  city: SavedCity;

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

  setCity(city: SavedCity){
    this.city = city;
  }

  getCity(): SavedCity{
    return this.city;
  }
  
  constructor() { }
}

//Simply stores and shares updates of the forecast values used in the current moment in the application
 