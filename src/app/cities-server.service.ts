import { Injectable } from '@angular/core';

import { SavedCity } from './savedCity';

import { HttpClient } from '@angular/common/http';

import { ServerResponse } from './servedCity'
import { SavedCitiesService } from './saved-cities.service';

@Injectable({
  providedIn: 'root'
})

/* This service interacts with the server Ontimize, with the service of cities */
export class CitiesServerService {

  citiesList: Array<SavedCity>;

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/cities/city";
  
  constructor(
    private http: HttpClient,
    private savedCitiesService: SavedCitiesService
  ) { }

  /**Inserts a new city to the database */
  upload(citiesList: Array<SavedCity>): Boolean {
    //Used to fill in the database
    if (citiesList === undefined) {
      return false;
    }

    let ok = true;

    citiesList.forEach(city => {
      this.http.post(this.commonUrl, city.insertBody()).subscribe(rx => {
        //We subscribe for the insert results
        console.log("Upload request results");
        console.log(rx);
      },
        error => {
          if (error.status === 500)
            console.log("Tried to upload an existing city: " + city.name);
          ok = false;
        });
    });
    return ok;
  }

  /**Searches cities by name in the database and returns an Array of them */
  searchByName(name: string): Array<SavedCity> {
    const ans = new Array<SavedCity>();

    this.http.post<ServerResponse>(this.commonUrl + "/search", this.complexSearch(name, "NAME")).subscribe(rx => {
      //We subscribe for the search results
      if (rx.data.length === undefined) {
        console.log("Query without results");
        return ans;
      }
      rx.data.forEach(item => {
        ans.push(
          new SavedCity(item.NAME, item.ID.toString(), item.COUNTRY, item.LON, item.LAT)
        );
      }, error => {
        console.log("Query to city dataBase failed");
      });
    }, err => {
      console.log(err);
    });

    return ans;
  }

/**Returns a complex search body using any parameter and its value in the city database */
  complexSearch(value: string, param: string): string {
    //primero comprobamos que el parámetro es válido
    if (param !== "NAME" && param !== "ID" && param !== "COUNTRY" && param !== "LAT" && param !== "LON") {
      param = "NAME";
    }

    return `{
      "filter": {
        "@basic_expression":{
          "lop" : "` + param + `",
          "op" : "LIKE",
          "rop" : "%` + value + `%"
        }
      },
      "columns":[ "ID","COUNTRY","LAT","LON","NAME"]
     }`;
  }

/**Returns a complex search body using ID and its value in the city database */
  complexSearchId(value: number, param: string): string {
    //primero comprobamos que el parámetro es válido
    if (param !== "NAME" && param !== "ID" && param !== "COUNTRY" && param !== "LAT" && param !== "LON") {
      param = "NAME";
    }

    return `{
      "filter": {
        "@basic_expression":{
          "lop" : "` + param + `",
          "op" : "=",
          "rop" : ` + value + `
        }
      },
      "columns":[ "ID","COUNTRY","LAT","LON","NAME"]
     }`;
  }

  /**Performs a city search by ID (primary key) in the database */
  searchById(city: number): SavedCity {
    //It is not considered the case of a wrong id as it is internally managed and the user cannot introduce its value directly
    let ans: SavedCity;

    this.http.post<ServerResponse>(this.commonUrl + "/search", this.complexSearchId(city, "ID")).subscribe(rx => {
      //We subscribe for the search results
      console.log(rx);
      rx.data.forEach(item => {
        ans = new SavedCity(item.NAME, item.ID.toString(), item.COUNTRY, item.LON, item.LAT);
      });
    });

    return ans;
  }

  /**Fills local array of cities after querying by IDs to the server */
  loadFavourites(cities: Array<string>) {
    //Queries every city by id in the user and stores it in localStorage as favourites

    cities.forEach(city => {
      this.http.post<ServerResponse>(this.commonUrl + "/search", this.complexSearchId(parseInt(city), "ID")).subscribe(rx =>
        this.savedCitiesService.save(new SavedCity(rx.data[0].NAME, rx.data[0].ID.toString(), rx.data[0].COUNTRY, rx.data[0].LON, rx.data[0].LAT))
      );
    });
  }

}