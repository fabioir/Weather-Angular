import { Component, OnInit, Input, HostListener } from '@angular/core';

import { WeatherService } from '../weather.service';

import { SavedCity } from '../savedCity';

import { HttpClient } from '@angular/common/http';

import { CitiesServerService } from '../cities-server.service';



@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
/*
This component is meant to show an initial view of the application.

It has got a search utility with which new cities can be accessed

Displays two answers from two different sources:

  An answer obtained searching by city name in the API

  An answer obtained searching in the Ontimize EE database through the server OR searching in a local list of cities downloaded from assets

Also display not recomended actions that may be necessary to perform when administrating the app
*/
export class InitialComponent implements OnInit {

  rxCity: SavedCity;
  cityMatch: SavedCity;
  found = false;
  loading = 'none';
  wasFound = 'none';
  citiesListURL = '../../assets/city.list.json';
  citiesList: Array<SavedCity>;
  foundCities: Array<SavedCity>;
  admin = false;
  keyAdmin = "";

  @Input() city: string = '';

  constructor(
    private weatherService: WeatherService,
    private http: HttpClient,
    private citiesServer: CitiesServerService
  ) {

  }

  /**The code includes a class in the body that produces from styles.css the display of a wallpaper */
  ngOnInit() {
    const body = document.getElementsByTagName("body");
    body[0].classList.add("initial-view");
  }

  /**Requests to the assets folder the JSON with all the cities. Heavy download*/
  getCitiesList() {
    this.citiesList = new Array<SavedCity>();
    this.http.get<Array<SavedCity>>(this.citiesListURL).subscribe(rx => {
      //Stores every city in the cities List were searches will be accomplished
      Array.from(rx).forEach(element => {
        this.citiesList.push(new SavedCity(element.name, element.id, element.country, element.coord.lon, element.coord.lat));
      });
    }

    );
    //This method isn't compatible with a optimum performance of the application as it consumes too much memory and bandwidth
  }


  /**This function looks for a service response searching with a city name*/
  getCity() {
    if (this.city.length == 0) {
      //If the city field has no value the search is not launched
      return;
    }

    this.loading = 'block';
    this.wasFound = 'none';

    this.weatherService.getWeatherByCityName(this.city).subscribe(rx => {
      //We subscribe for the search results
      this.rxCity = <SavedCity>rx;
      this.cityMatch = new SavedCity(this.rxCity.name, this.rxCity.id, this.rxCity.sys.country);
      this.found = true;
      this.loading = 'none';
    },
      error => {
        this.found = false;
        this.loading = 'none';
        this.wasFound = 'block';
      });

  }


  /**If there exist a local list it is used to search, but if not available asks the API for results through getCity and the API for suggestions */
  search(): void {
    if (this.city.length == 0) {
      //If the city field has no value the search is not launched
      return;
    }

    this.getCity(); //Asks the API

    //Search in the cities.JSON is enabled. It produces a performance leakage
    if ((this.city.length > 0) && (this.citiesList !== undefined)) {
      this.foundCities = this.citiesList.filter(element => {

        return (element.name.includes(this.city));
      });
    }


    //Search in the dataBase through the server Ontimize EE
    this.foundCities = this.citiesServer.searchByName(this.city);

  }

  /**This function should not be called because it makes the app crash. However, it has been able to make all the inserts correctly in the dataBase.*/
  uploadAll() {
    console.log(
      this.citiesServer.upload(<Array<SavedCity>>this.citiesList)
    );

    console.log("complete upload of citiesList to the dataBase");
  }

  /**Show/Hide admin options*/
  toggleAdmin() {
    this.admin = !this.admin;
  }

  //Listens to the keyboard and triggers a function to show admin options when "admin" is written
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    this.keyAdmin = this.keyAdmin + event.key;
    if (this.keyAdmin.substr(-5) === "admin") {
      this.toggleAdmin();
      this.keyAdmin = "";
    }

  }

}