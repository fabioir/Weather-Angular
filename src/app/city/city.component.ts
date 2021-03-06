import { Component, OnInit } from '@angular/core';
import { SavedCity } from '../savedCity';
import { WeatherService } from '../weather.service';
import { WeatherNow } from '../weatherNow';
import { ActivatedRoute } from '@angular/router';

import { SavedCitiesService } from '../saved-cities.service';
import { ForecastValuesService } from '../forecast-values.service';

import { MatTableDataSource } from '@angular/material';

import { Data, Forecast, RespuestaForecast } from './data';

import { MatSnackBar } from '@angular/material'


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})


/* 
This component shows the information adquired from the microservice through the weather service. It gets the city code from the URL.

From this component it is possible to save a new city to the local storage.

Asks for a WeatherNow object with the city weather info to

Includes in its template a button that routes to the GraphsComponent, which shows several forecast graphs.
*/
export class CityComponent implements OnInit {

  cityShown: SavedCity;
  weatherNow: WeatherNow;
  rx: Object;
  valuesDisplayed: Array<Data>;
  dataSource;
  displayedColumns = ['parameter', 'value'];
  forecast = new Array<Forecast>();
  showForecast = false;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherService,
    private savedCitiesService: SavedCitiesService,
    private forecastValuesService: ForecastValuesService,
    private snackBar: MatSnackBar
  ) {
    //listen to a change in the path to refresh info
    this.route.params.subscribe((value: PopStateEvent) => {
      this.getCityWeather();
    });
  }

  ngOnInit() { }

  /**Gets id from URL and asks weather service for the current weather and forecast storing it in Objects and preparing table data. Updates forecast service Data */
  getCityWeather() {

    //Get the parameters from the URL
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');

    this.cityShown = new SavedCity(name, id);

    this.weatherService.getWeather(this.cityShown.id).subscribe(rx => {
      this.rx = rx
      //Put the values received in the object weatherNow
      this.weatherNow = new WeatherNow();
      this.weatherNow.set(<WeatherNow>rx);

      //Display the values
      this.valuesDisplayed = this.weatherNow.displayValues();
      //dataSource is used to represent the data in the mat table
      this.dataSource = new MatTableDataSource(this.valuesDisplayed);
    });

    this.weatherService.getForecast(this.cityShown.id).subscribe((rx: RespuestaForecast) => {

      this.forecast = [];

      Array.from(rx.list).forEach(element => {
        this.forecast.push(new Forecast(element));
      });
      //Updates the service with the current city forecasted values
      this.forecastValuesService.setValues(this.forecast);
      this.forecastValuesService.setCity(this.cityShown);

    });
  }

  /**Completes the cityShown info before storing it to localhost (Favourites) */
  saveCity() {
    this.cityShown.country = this.weatherNow.sys.country;
    this.cityShown.coord = this.weatherNow.coord;
    this.savedCitiesService.save(this.cityShown);

    this.snackBar.open(`${this.cityShown.name} saved to favourites`, `Ok`, { duration: 3000 });
  }


}