import { Component, OnInit, OnChanges } from '@angular/core';
import { SavedCity } from '../savedCity';
import { WeatherService } from '../weather.service';
import { WeatherNow } from '../weatherNow';
import { ActivatedRoute, Route } from '@angular/router';
import { Location } from '@angular/common';

import { SavedCitiesService } from '../saved-cities.service';

import {DataSource} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import { Data } from './data'

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
}) 
export class CityComponent implements OnInit {

  cityShown: SavedCity;
  weatherNow : WeatherNow;
  rx : Object;
  valuesDisplayed : Array<Data>;
  dataSource;
  displayedColumns = ['parameter','value'];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private weatherService: WeatherService,
    private savedCitiesService: SavedCitiesService
  ) {
    //listen to a change in the path to refresh info
    this.route.params.subscribe((value: PopStateEvent) => {
      this.getCityWeather();
    }); 
   }

  ngOnInit() {
  }


  getCityWeather() {
    
    //Get the parameters from the URL
    const id = this.route.snapshot.paramMap.get('id');
    const name = this.route.snapshot.paramMap.get('name');

    this.cityShown = new SavedCity(name,id);

    this.weatherService.getWeather(this.cityShown.id).subscribe(rx => {
      this.rx = rx
      //Put the values received in the object weatherNow
      this.weatherNow = new WeatherNow();
      this.weatherNow.set(<WeatherNow>rx);

      //Display the values
      this.valuesDisplayed = this.weatherNow.displayValues();
      //dataSource is used to represent the data in the mat table
      this.dataSource = new MatTableDataSource(this.valuesDisplayed);
    });
  }

  saveCity() {
    this.savedCitiesService.save(this.cityShown);
  }
  
}
/* 
This component shows the information adquired from the microservice through the weather service. It gets the city code from the URL.

From this component it is possible to save a new city.
*/