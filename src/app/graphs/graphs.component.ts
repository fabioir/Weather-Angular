import { Component, OnInit } from '@angular/core';
import { ForecastValuesService } from '../forecast-values.service';
import { Forecast, RespuestaForecast } from '../city/data';
import { TemperatureService } from './temperature/temperature.service';
import { RainAndSnowService } from './rainAndSnow/rain-and-snow.service';
import { CloudsAndWindService } from './cloudsAndWind/clouds-and-wind.service';
import { WeatherService } from '../weather.service';
import { ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  forecastValues: Array<Forecast>;
  temperatures: number[];
  temperaturesMax: number[];
  temperaturesMin: number[];
  rain: number[];
  snow: number[];
  dates: string[];
  temperatureChart: Chart;
  rainAndSnowChart: Chart;
  cloudsAndWindChart: Chart;
  city;
  temperatureColor = "";
  rainColor = "";
  cloudColor = "";

  constructor(
    private forecastValuesService: ForecastValuesService,
    private temperatureService: TemperatureService,
    private rainAndSnowService: RainAndSnowService,
    private cloudsAndWindService: CloudsAndWindService,
    private weatherService: WeatherService,
    private route: ActivatedRoute
  ) {
    //Updates values from the service
    this.forecastValues = forecastValuesService.getValues();
    //Updates the chart every time values change
    forecastValuesService.getUpdates().subscribe(values => {
      this.forecastValues = values;
      //If the city changes, charts do so
      //Clean charts
      if (this.temperatureChart) {
        this.temperatureChart = undefined;
      }
      if (this.rainAndSnowChart) {
        this.rainAndSnowChart = undefined;
      }
      if (this.cloudsAndWindChart) {
        this.cloudsAndWindChart = undefined;
      }
    });
  }

  ngOnInit() {

    this.city = this.route.snapshot.paramMap.get('name');
    const id = this.route.snapshot.paramMap.get('id');

    this.weatherService.getForecast(id).subscribe((rx: RespuestaForecast) => {

      this.forecastValues = [];

      Array.from(rx.list).forEach(element => {
        this.forecastValues.push(new Forecast(element));
      });
      //Updates the service with the current city forecasted values
      this.forecastValuesService.setValues(this.forecastValues);

      this.temperature();
    });
  }

  temperature() {
    /**Changes button color to displayed and erases the other charts to show temperatures chart or erases temperatures chart */
    if (this.temperatureChart === undefined) {
      this.temperatureColor = "primary";
      this.cloudColor = "";
      this.rainColor = "";
      this.cloudsAndWindChart = undefined;
      this.rainAndSnowChart = undefined;

      this.forecastValues = this.forecastValuesService.getValues();

      this.temperatureChart = this.temperatureService.getTemperatureChart(this.forecastValues);
    } else {
      //Makes the chart dissapear
      this.temperatureChart = undefined;
      this.temperatureColor = "";
    }

  }

  rainAndSnow() {
    /**Changes button color to displayed and erases the other charts to show raind and snow chart or erases raind and snow chart */
    if (this.rainAndSnowChart === undefined) {
      this.rainColor = "primary";
      this.temperatureColor = "";
      this.cloudColor = "";
      this.temperatureChart = undefined;
      this.cloudsAndWindChart = undefined;

      this.forecastValues = this.forecastValuesService.getValues();

      this.rainAndSnowChart = this.rainAndSnowService.getRainAndSnowChart(this.forecastValues);
    } else {
      //Makes the chart dissapear
      this.rainAndSnowChart = undefined;
      this.rainColor = "";
    }
  }

  cloudsAndWind() {
    /**Changes button color to displayed and erases the other charts to show clouds and wind chart or erases clouds and wind chart */
    if (this.cloudsAndWindChart === undefined) {
      this.cloudColor = "primary";
      this.temperatureColor = "";
      this.rainColor = "";
      this.temperatureChart = undefined;
      this.rainAndSnowChart = undefined;

      this.forecastValues = this.forecastValuesService.getValues();

      this.cloudsAndWindChart = this.cloudsAndWindService.getCloudsAndWindChart(this.forecastValues);
    } else {
      //Makes the chart dissapear
      this.cloudsAndWindChart = undefined;
      this.cloudColor = "";
    }
  }

}
/* This component shows and deletes the charts and obtains them from the corresponding services */