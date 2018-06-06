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

  getCloudsAndWindChart(forecast: Array<Forecast>): Chart{
    
    this.clouds = forecast.map(item => { 
      return item.clouds.all;});

    this.wind = forecast.map(item => { 
      return item.wind.speed;});

    this.dates = forecast.map(item => {
      return item.dt_txt;
    });

      this.chart = new Chart('canvas', {
        type: 'bar',
      data: {
        labels: this.dates,
        datasets: [
         
          { 
            label: 'Wind speed',
            data: this.wind,
            borderColor: "#BADA55",
            fill: false,
            backgroundColor: "#aaaaaa",
            type: 'line',
            yAxisID: 'Wind'
          }, { 
            label: 'Clouds percentage',
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
          display: true,
          labels: {
            
          }
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
          },{
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
