import { Injectable } from '@angular/core';

import { SavedCity } from './savedCity';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ServerResponse, ServedCity } from './servedCity'

@Injectable({
  providedIn: 'root'
})
export class CitiesServerService {

  citiesList: Array<SavedCity>;

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/cities/city";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';
     
  constructor(
    private http: HttpClient 
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
      
      rx.data.forEach(item => {
        ans.push(
          new SavedCity(item.NAME,item.ID.toString(),item.COUNTRY,item.LON,item.LAT)
        );
      });
    });


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
}
