import { Injectable } from '@angular/core';
import { Forecast } from '../../city/data';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class RainAndSnowService {

  chart: Chart;
  rain: number[];
  snow: number[];
  dates: string[];

  constructor() { }

  getRainAndSnowChart(forecast: Array<Forecast>): Chart{

    this.rain = forecast.map(item => { 
      return item.rain;});

    this.snow = forecast.map(item => { 
      return item.snow;});

    this.dates = forecast.map(item => {
      return item.dt_txt;
    });

      this.chart = new Chart('rainAndSnow', {
        type: 'bar',
      data: {
        labels: this.dates,
        datasets: [
          { 
            label: 'Rain',
            data: this.rain,
            borderColor: "#0000ff",
            fill: false,
            showLine: true,
            backgroundColor: "#0000ff"
          },
          { 
            label: 'Snow',
            data: this.snow,
            borderColor: "#ffffff",
            fill: false,
            backgroundColor: "#aaaaaa"
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
