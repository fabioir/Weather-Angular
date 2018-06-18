import { Injectable } from '@angular/core';

import { SavedCity } from './savedCity';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ServerResponse, ServedCity } from './servedCity'
import { SavedCitiesService } from './saved-cities.service';

@Injectable({
  providedIn: 'root'
})
export class CitiesServerService {

  citiesList: Array<SavedCity>;

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/cities/city";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';
     
  constructor(
    private http: HttpClient,
    private savedCitiesService: SavedCitiesService
  ) { }

  upload(citiesList: Array<SavedCity>): Boolean {


    if(citiesList === undefined){
      return false;
    }

    let ok = true;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    citiesList.forEach( city => {
      this.http.post(this.commonUrl,city.insertBody(),httpOptions).subscribe(rx => {
        //We subscribe for the search results
        console.log(rx);
      },
      error => {
       ok = false;
      });
    });
    return ok;
  }

  searchByName(name: string): Array<SavedCity>{
    const ans = new Array<SavedCity>();
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };


    this.http.post<ServerResponse>(this.commonUrl + "/search",this.complexSearch(name,"NAME"),httpOptions).subscribe(rx => {
      //We subscribe for the search results
      console.log(rx.data.length);
      if(rx.data.length === undefined){
        console.log("Query without results");
        return ans;
      }
      rx.data.forEach(item => {
        ans.push(
          new SavedCity(item.NAME,item.ID.toString(),item.COUNTRY,item.LON,item.LAT)
        );
      }, error => {
        console.log("Query to city dataBase failed");
      });
    },
  );


    return ans; 
  }
  
  log(): Boolean{
    console.log("LOG");
    return true;
  }

  complexSearch(value: string, param: string): string{
    //primero comprobamos que el parámetro es válido
    if(param !== "NAME" && param !== "ID" && param !== "COUNTRY" && param !== "LAT" && param !== "LON"){
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

  complexSearchId(value: number, param: string): string{
    //primero comprobamos que el parámetro es válido
    if(param !== "NAME" && param !== "ID" && param !== "COUNTRY" && param !== "LAT" && param !== "LON"){
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
  
  searchById(city: number): SavedCity{
    let ans : SavedCity;

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };

    this.http.post<ServerResponse>(this.commonUrl + "/search",this.complexSearchId(city,"ID"),httpOptions).subscribe(rx => {
      //We subscribe for the search results
      console.log(rx);
      rx.data.forEach(item => {
        ans = new SavedCity(item.NAME,item.ID.toString(),item.COUNTRY,item.LON,item.LAT);
      });
    });

    return ans;
  }

  loadFavourites(cities : Array<string>){
    //Queries every city by id in the user and stores it in localStorage as favourites
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    cities.forEach(city => {
      this.http.post<ServerResponse>(this.commonUrl + "/search",this.complexSearchId(parseInt(city),"ID"),httpOptions).subscribe(rx =>
        this.savedCitiesService.save(new SavedCity(rx.data[0].NAME,rx.data[0].ID.toString(),rx.data[0].COUNTRY,rx.data[0].LON,rx.data[0].LAT))
      );
    });
  }

}
