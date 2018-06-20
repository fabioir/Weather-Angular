import { Component, OnInit, Input, HostListener } from '@angular/core';

import { WeatherService } from '../weather.service';

import { WeatherNow } from '../weatherNow';
import { SavedCity } from '../savedCity';

import { SavedCitiesService } from '../saved-cities.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CitiesServerService } from '../cities-server.service';


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
  citiesListURL = '../../assets/city.list.json';
  citiesList : Array<SavedCity>;
  foundCities : Array<SavedCity>;
  admin = false;
  keyAdmin = "";
  
  @Input() city: string = '';

  constructor(
    private weatherService: WeatherService,
    private http: HttpClient,
    private citiesServer: CitiesServerService
  ) { }

  ngOnInit() {
    //this.getCitiesList();
  }

  getCitiesList(){
    this.citiesList = new Array<SavedCity>();
    this.http.get<Array<SavedCity>>(this.citiesListURL).subscribe(rx => {
      
      Array.from(rx).forEach(element => {
       this.citiesList.push(new SavedCity(element.name, element.id, element.country, element.coord.lon, element.coord.lat));
      });
    }

    );
    
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
        this.cityMatch = new SavedCity(this.rxCity.name, this.rxCity.id, this.rxCity.sys.country );
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
    //Search in the cities.JSON is disabled
    /*if((this.city.length>0)&&(this.citiesList !== undefined)){
      this.foundCities = this.citiesList.filter(element => {
        
        return (element.name.includes(this.city));
      });
    }*/
      this.getCity();
      if(this.city.length == 0){
        //If the city field has no value the search is not launched
        return;
       }
      //Search in the dataBase through the server in java
      this.foundCities = this.citiesServer.searchByName(this.city);
      
  }

  uploadAll(){
    //This function should not be called because it makes the app crash. However, it has been able to make all the inserts correctly in the dataBase.
    this.citiesServer.log();
    console.log(
    this.citiesServer.upload(<Array<SavedCity>> this.citiesList)
    );

    console.log("complete upload of citiesList to the dataBase");
  }

toggleAdmin(){
  //Show/Hide admin options
  this.admin = !this.admin;
}
@HostListener('window:keyup',['$event'])
keyEvent(event: KeyboardEvent){
  
  this.keyAdmin = this.keyAdmin + event.key;
  if(this.keyAdmin.substr(-5) === "admin"){
    this.toggleAdmin();
    this.keyAdmin = "";
  }
  
}
  
}
/*
This component is meant to show an initial view of the application.

It has got a search utility with which new cities can be accessed
*/