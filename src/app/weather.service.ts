import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=Vigo&APPID=888b7bb3ed5f95fb9894b5c33589e6a6';



  constructor(private http: HttpClient) { }

  getWeather(id: string): Observable<Object> {
    /**Unique identifier search */
    this.weatherURL = `https://api.openweathermap.org/data/2.5/weather?id=${id}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }
  getWeatherByCityName(name: string): Observable<Object> {
    /**Search by name, used to get city objects, may lead to missunderstanding with city location */
    this.weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${name}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }

  getForecast(id: string): Observable<Object> {
    /**Gets the free forecast by unique ID from OpenWeatherMap API */
    this.weatherURL = `https://api.openweathermap.org/data/2.5/forecast?id=${id}&APPID=888b7bb3ed5f95fb9894b5c33589e6a6`;
    return this.http.get(this.weatherURL);
  }
}
/** Service that makes requests to the API "OpenWeather" and return its responses*/