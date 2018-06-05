import { Component, OnInit } from '@angular/core';
import { ForecastValuesService } from '../forecast-values.service';
import { Forecast } from '../city/data';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.css']
})
export class GraphsComponent implements OnInit {

  forecastValues : Array<Forecast>;
  temperatures : string;

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
  }

}
