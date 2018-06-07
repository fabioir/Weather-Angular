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

  forecastValues : Array<Forecast>;
  temperatures : number[];
  temperaturesMax : number[];
  temperaturesMin : number[];
  rain: number[];
  snow: number[];
  dates: string[];
  temperatureChart : Chart;
  rainAndSnowChart : Chart;
  cloudsAndWindChart : Chart;
  //forecastValuesService: ForecastValuesService;
  
  constructor(
    private forecastValuesService: ForecastValuesService,
    private temperatureService: TemperatureService,
    private rainAndSnowService: RainAndSnowService,
    private cloudsAndWindService: CloudsAndWindService
  ) { 

    //this.forecastValuesService = forecastValuesService;

    this.forecastValues = forecastValuesService.getValues();

    forecastValuesService.getUpdates().subscribe( values => {
      this.forecastValues = values;
    });
  }

  ngOnInit() {
    //console.log(this.forecastValues);
    //console.log("Init of graphs components");
  }

  temperature(){
    if(this.temperatureChart === undefined){
    this.forecastValues = this.forecastValuesService.getValues();

    this.temperatureChart = this.temperatureService.getTemperatureChart(this.forecastValues);
    }else{
      this.temperatureChart = undefined;
    }
  
  }

  rainAndSnow(){
    if(this.rainAndSnowChart === undefined){
    this.forecastValues = this.forecastValuesService.getValues();

    this.rainAndSnowChart = this.rainAndSnowService.getRainAndSnowChart(this.forecastValues);
    }else{
      this.rainAndSnowChart = undefined;
    }
  }

  cloudsAndWind(){
    if(this.cloudsAndWindChart === undefined){
    this.forecastValues = this.forecastValuesService.getValues();

    this.cloudsAndWindChart = this.cloudsAndWindService.getCloudsAndWindChart(this.forecastValues);
    }else{
      this.cloudsAndWindChart = undefined;
    }
  }
    
}
