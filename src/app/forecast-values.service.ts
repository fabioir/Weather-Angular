import { Injectable } from '@angular/core';
import { Forecast } from './city/data';
import { Observable, Subject } from 'rxjs';
import { SavedCity } from './savedCity';

@Injectable({
  providedIn: 'root'
})

/**Simply stores and shares updates of the forecast values used in the current moment in the application*/
export class ForecastValuesService {

  forecastValues = Array<Forecast>();
  updated = new Subject();
  city: SavedCity;

  /**Returns an Observable to get changes in the current forecast values */
  getUpdates(): Observable<Array<Forecast>> {
    return <Observable<Array<Forecast>>>this.updated.asObservable();
  }

  /**Sets the current forecast values */
  setValues(values: Array<Forecast>) {
    this.forecastValues = values;
    this.updated.next(this.forecastValues);
  }

  /**Returns the current forecast values */
  getValues(): Array<Forecast> {
    return this.forecastValues;
  }

  /**Sets the current city (may not be used in the app)*/
  setCity(city: SavedCity) {
    this.city = city;
  }
  /**Returns the current city */
  getCity(): SavedCity {
    return this.city;
  }

  constructor() { }
}
