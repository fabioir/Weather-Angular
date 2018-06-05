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
  temperatures : string;
  chart : Chart;

  constructor(forecastValuesService: ForecastValuesService) { 

    this.forecastValues = forecastValuesService.getValues();

    forecastValuesService.getUpdates().subscribe( values => {
      this.forecastValues = values;
    });
  }

  ngOnInit() {
    console.log(this.forecastValues);
  }

  temperature(){
    this.temperatures = this.forecastValues.map(item => { 
      //console.log(item.main.temp);
      return item.main.temp;}).join(' , ');

      this.chart = new Chart('canvas', {
        type: 'line',
      data: {
        labels: ['1','2','3'],
        datasets: [
          { 
            data: this.forecastValues.map(item => { 
              //console.log(item.main.temp);
              return item.main.temp;}),
            borderColor: "#3cba9f",
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
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

}
