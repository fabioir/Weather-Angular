import { Injectable } from '@angular/core';
import { Forecast } from '../../city/data';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class TemperatureService {

  chart: Chart;
  temperatures: number[];
  temperaturesMax: number[];
  temperaturesMin: number[];
  dates: string[];

  constructor() { }

  getTemperatureChart(forecast: Array<Forecast>): Chart {
    
    this.temperatures = forecast.map(item => {
      //console.log(item.main.temp);
      return item.main.temp - 273.15;
    });


    this.temperaturesMax = forecast.map(item => {
      //console.log(item.main.temp);
      return item.main.temp_max - 273.15;
    });

    this.temperaturesMin = forecast.map(item => {
      //console.log(item.main.temp);
      return item.main.temp_min - 273.15;
    });

    this.dates = forecast.map(item => {
      return item.dt_txt;
    });

    this.chart = new Chart('temperature', {
      type: 'line',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'temperature',
            data: this.temperatures,
            borderColor: "#3cba9f",
            fill: false,
            showLine: true
          },
          {
            label: 'Max temperature',
            data: this.temperaturesMax,
            borderColor: "#ff0000",
            fill: false
          },
          {
            label: 'Min temperature',
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

/* This service gets the forecast vakues formated and returns a chart*/