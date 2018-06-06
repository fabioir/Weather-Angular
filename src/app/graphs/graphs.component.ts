import { Component, OnInit } from '@angular/core';
import { ForecastValuesService } from '../forecast-values.service';
import { Forecast } from '../city/data';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  forecastValues : Array<Forecast>;
  temperatures : number[];
  temperaturesMax : number[];
  temperaturesMin : number[];
  rain: number[];
  snow: number[];
  dates: string[];
  chart : Chart;
  //forecastValuesService: ForecastValuesService;

  constructor(forecastValuesService: ForecastValuesService) { 

    //this.forecastValuesService = forecastValuesService;

    this.forecastValues = forecastValuesService.getValues();

    forecastValuesService.getUpdates().subscribe( values => {
      this.forecastValues = values;
    });
  }

  ngOnInit() {
   
    console.log(this.forecastValues);
    console.log("Init of graphs components");
  }

  temperature(){
    this.temperatures = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.main.temp - 273.15;});

    this.temperaturesMax = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.main.temp_max - 273.15;});

    this.temperaturesMin = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.main.temp_min - 273.15;});

    this.dates = this.forecastValues.map(item => {
      return item.dt_txt;
    });

      this.chart = new Chart('canvas', {
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
  }

  rainAndSnow(){
    this.rain = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.rain;});

    this.snow = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.snow;});

    this.dates = this.forecastValues.map(item => {
      return item.dt_txt;
    });

      this.chart = new Chart('canvas', {
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
  }

  cloudsAndWind(){}
    
}
