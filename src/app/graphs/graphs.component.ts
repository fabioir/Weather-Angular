import { Component, OnInit } from '@angular/core';
import { ForecastValuesService } from '../forecast-values.service';
import { Forecast } from '../city/data';
import { Chart } from 'chart.js';
import { TemperatureService } from './temperature/temperature.service';
import { RainAndSnowService } from './rainAndSnow/rain-and-snow.service';
import { CloudsAndWindService } from './cloudsAndWind/clouds-and-wind.service';

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

  constructor(
    private forecastValuesService: ForecastValuesService,
    private temperatureService: TemperatureService,
    private rainAndSnowService: RainAndSnowService,
    private cloudsAndWindService: CloudsAndWindService
  ) {

    this.forecastValues = forecastValuesService.getValues();

    forecastValuesService.getUpdates().subscribe(values => {
      this.forecastValues = values;
      //If the city changes, charts do so

      if (this.temperatureChart) {
        this.temperatureChart = undefined;
        this.temperature();
      }
      if (this.rainAndSnowChart) {
        this.rainAndSnowChart = undefined;
        this.rainAndSnow();
      }
      if (this.cloudsAndWindChart) {
        this.cloudsAndWindChart = undefined;
        this.cloudsAndWind();
      }
    });
  }

  ngOnInit() {
  }

  temperature() {
    if (this.temperatureChart === undefined) {
      this.forecastValues = this.forecastValuesService.getValues();

      this.temperatureChart = this.temperatureService.getTemperatureChart(this.forecastValues);
    } else {
      //Makes the chart dissapear
      this.temperatureChart = undefined;
    }

  }

  rainAndSnow() {
    if (this.rainAndSnowChart === undefined) {
      this.forecastValues = this.forecastValuesService.getValues();

      this.rainAndSnowChart = this.rainAndSnowService.getRainAndSnowChart(this.forecastValues);
    } else {
      this.rainAndSnowChart = undefined;
    }
  }

  cloudsAndWind() {
    if (this.cloudsAndWindChart === undefined) {
      this.forecastValues = this.forecastValuesService.getValues();

      this.cloudsAndWindChart = this.cloudsAndWindService.getCloudsAndWindChart(this.forecastValues);
    } else {
      this.cloudsAndWindChart = undefined;
    }
  }

}
/* This component shows and deletes the charts and obtains them from the services */