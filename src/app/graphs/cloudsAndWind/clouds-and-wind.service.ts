import { Injectable } from '@angular/core';
import { Forecast } from '../../city/data';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class CloudsAndWindService {

  chart: Chart;
  wind: number[];
  clouds: number[];
  dates: string[];

  getCloudsAndWindChart(forecast: Array<Forecast>): Chart {
    /**Returns a chart with Clouds and Wind data */
    this.clouds = forecast.map(item => {
      //extracts a Array with numbers indicating the clouds percentage
      return item.clouds.all;
    });

    this.wind = forecast.map(item => {
      //extracts a Array with numbers indicating wind speed km/h
      return item.wind.speed;
    });

    this.dates = forecast.map(item => {
      //extracts a Array with strings indicating dates
      return item.dt_txt;
    });

    this.chart = new Chart('cloudsAndWind', {
      type: 'bar',
      data: {
        labels: this.dates,
        datasets: [

          {
            label: 'Wind speed km/h',
            data: this.wind,
            borderColor: "#BADA55",
            fill: false,
            backgroundColor: "#aaaaaa",
            type: 'line', //The wind is not presented in bars
            yAxisID: 'Wind'
          }, {
            label: 'Clouds percentage %',
            data: this.clouds,
            borderColor: "#cccccc",
            fill: false,
            showLine: true,
            backgroundColor: "#cccccc",
            yAxisID: 'Clouds'
          }
        ]
      },
      options: {

        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            id: 'Wind',
            display: true,
            ticks: {
              min: 0,
              max: Math.max(...this.wind)
            }
          }, {
            id: 'Clouds',
            display: true,
            ticks: {
              min: 0,
              max: 100
            }
          }],
        }
      }
    });

    return this.chart;
  }

  constructor() { }
}
/** This service gets the forecast values formated and returns a clouds and wind chart*/