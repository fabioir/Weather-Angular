import { Injectable } from '@angular/core';
import { Forecast } from '../../city/data';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})

/* This service gets the forecast values formated and returns a rain and snow chart*/
export class RainAndSnowService {

  chart: Chart;
  rain: number[];
  snow: number[];
  dates: string[];

  constructor() { }
  /**Returns a chart with Rain and Snow data */
  getRainAndSnowChart(forecast: Array<Forecast>): Chart {

    this.rain = forecast.map(item => {
      //extracts a Array with numbers indicating the rain forecast l/m^2
      return item.rain;
    });

    this.snow = forecast.map(item => {
      //extracts a Array with numbers indicating the snow forecast l/m^2
      return item.snow;
    });

    this.dates = forecast.map(item => {
      //extracts a Array with strings indicating dates
      return item.dt_txt;
    });

    this.chart = new Chart('rainAndSnow', {
      type: 'bar',
      data: {
        labels: this.dates,
        datasets: [
          {
            label: 'Rain l/m^2',
            data: this.rain,
            borderColor: "#0000ff",
            fill: false,
            showLine: true,
            backgroundColor: "#0000ff"
          },
          {
            label: 'Snow l/m^2',
            data: this.snow,
            borderColor: "#ffffff",
            fill: false,
            backgroundColor: "#aaaaaa"
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
            display: true
          }],
        }
      }
    });

    return this.chart;
  }
}
