import { Injectable } from '@angular/core';
import { Forecast } from '../../city/data';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})

/* This service gets the forecast values formated and returns a temperature chart*/
export class TemperatureService {

  chart: Chart;
  temperatures: number[];
  temperaturesMax: number[];
  temperaturesMin: number[];
  dates: string[];

  constructor() { }

  /**Returns a chart with temperatures data */
  getTemperatureChart(forecast: Array<Forecast>): Chart {

    this.temperatures = forecast.map(item => {
      //extracts a Array with numbers indicating the expected temperatures ºC
      return item.main.temp - 273.15;
    });


    this.temperaturesMax = forecast.map(item => {
      //extracts a Array with numbers indicating the maximum temperatures ºC
      return item.main.temp_max - 273.15;
    });

    this.temperaturesMin = forecast.map(item => {
      //extracts a Array with numbers indicating the minimum temperatures ºC
      return item.main.temp_min - 273.15;
    });

    this.dates = forecast.map(item => {
      //extracts a Array with strings indicating dates
      return item.dt_txt;
    });

    this.chart = new Chart('temperature', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'temperature ºC',
            data: this.temperatures,
            borderColor: "#3cba9f",
            fill: false,
            showLine: true
          },
          {
            label: 'Max temperature ºC',
            data: this.temperaturesMax,
            borderColor: "#ff0000",
            fill: false
          },
          {
            label: 'Min temperature ºC',
            data: this.temperaturesMin,
            borderColor: "#0000FF",
            fill: false
          }
        ]
      },
      options: {

        legend: {
          display: true,
          labels: {

          }
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });

    return this.chart;
  }

}
