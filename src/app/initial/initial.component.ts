import { Component, OnInit, Input } from '@angular/core';

import { WeatherService } from '../weather.service';

import { WeatherNow } from '../weatherNow';
import { SavedCity } from '../savedCity';

import { SavedCitiesService } from '../saved-cities.service';


@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  rxCity : SavedCity;
  cityMatch : SavedCity;
  found = false;
  loading = 'none';
  wasFound = 'none';
  
  
  @Input() city: string = '';

  constructor(private weatherService: WeatherService) { }

  ngOnInit() {
  }


  getCity() {
    //This function looks for a service response searching with a city name

      if(this.city.length == 0){
       //If the city field has no value the search is not launched
       return;
      }
      
      this.loading = 'block';
      this.wasFound = 'none';

      this.weatherService.getWeatherByCityName(this.city).subscribe(rx => {
        //We subscribe for the search results
        this.rxCity = <SavedCity>rx;
        this.cityMatch = new SavedCity(this.rxCity.name + ' (' + (this.rxCity.sys.country || '') + ')',this.rxCity.id);
        this.found = true;
        this.loading = 'none';
      },
      error => {
        this.found = false;
        this.loading = 'none';
        this.wasFound = 'block';
      });
  
  }


  search(): void {
   
      this.getCity();
      
  }

  
}
/*
This component is meant to show an initial view of the application.

It has got a search utility with which new cities can be accessed
*/