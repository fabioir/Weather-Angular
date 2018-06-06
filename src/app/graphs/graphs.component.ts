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
  chart : Chart;
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
    console.log(this.forecastValues);
    console.log("Init of graphs components");
  }

  temperature(){
    console.log("TEMPERATURE!");
    this.chart = undefined;
    this.forecastValues = this.forecastValuesService.getValues();

    this.chart = this.temperatureService.getTemperatureChart(this.forecastValues);
    
  }

  rainAndSnow(){
    this.chart = undefined;
    this.forecastValues = this.forecastValuesService.getValues();

    this.chart = this.rainAndSnowService.getRainAndSnowChart(this.forecastValues);
  }

  cloudsAndWind(){
    this.chart = undefined;
    this.forecastValues = this.forecastValuesService.getValues();

    this.chart = this.cloudsAndWindService.getCloudsAndWindChart(this.forecastValues);
  }
    
}
