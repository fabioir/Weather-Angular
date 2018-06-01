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
  savedCities : SavedCity[];
  cityMatch : SavedCity;
  found = false;
  
  @Input() city: string = '';

  constructor(
    private weatherService: WeatherService, 
    private savedCitiesService: SavedCitiesService) { }

  ngOnInit() {
     this.getCities();
  }

  /*getWeather(): void {

    if(this.city.length == 0){

      //If the city field has no value the search is not made

      //console.log("City field is empty");
      return;
    }

    console.log('Asking weather service to search with id: ' + this.cityId);
    this.weatherService.getWeather(this.cityId).subscribe(rx => {
      this.rx = <WeatherNow>rx;

      
      
      //Put the values in the object weatherNow
      
      //console.log(this.weatherNow.displayValues());
    });
  }*/

  getCity() {
    //This function looks for a service response searching with a city name

      if(this.city.length == 0){

       //If the city field has no value the search is not made

       //console.log("City field is empty");
       return;
      }

      this.weatherService.getWeatherByCityName(this.city).subscribe(rx => {
        /*rx.weather.forEach(w => {
          console.log(w.id);
        });*/
        
        this.rxCity = <SavedCity>rx;
        this.cityMatch = new SavedCity(this.rxCity.name,this.rxCity.id);
        this.found = true;
        this.messages();
      },
      error => {
        this.found = false;
        this.messages();
      });
  
  }


  refresh(): void {
   
      this.getCity();
      
  }

  messages(){

    //This function shows messages about the search results

    if(!this.found){
      console.log("We've found a city! ");
      //console.log('The city searched has not been found');
    }else{
      //console.log('The search was successful');
    }
  }

  getCities() {
    this.savedCities = this.savedCitiesService.getSavedCities();
  }
}
/*
This component is meant to show an initial view of the application.

It has got a search utility with which new cities can be accessed
*/