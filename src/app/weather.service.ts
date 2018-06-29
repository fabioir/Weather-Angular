import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'


@Injectable({
  providedIn: 'root'
})

/** Service that makes requests to the API "OpenWeather" and return its responses*/
export class WeatherService {

  private weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=Vigo&APPID=888b7bb3ed5f95fb9894b5c33589e6a6';



  constructor(private http: HttpClient) { }

  /**Unique identifier search */
  getWeather(id: string): Observable<Object> {
    this.weatherURL = `https://api.openweathermap.org/data/2.5/weather?id=${id}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }

  /**Search by name, used to get city objects, may lead to missunderstanding with city location */
  getWeatherByCityName(name: string): Observable<Object> {
    this.weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }

  /**Gets the free forecast by unique ID from OpenWeatherMap API */
  getForecast(id: string): Observable<Object> {
    this.weatherURL = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }
}