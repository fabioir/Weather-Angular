import { Injectable } from '@angular/core';
import { SavedCitiesService } from './saved-cities.service';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerResponse, ServedCity } from './servedCity'

@Injectable({
  providedIn: 'root'
})
export class LogService {


  cities : Array<SavedCity>;
  updated = new Subject();

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/log/log";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';

  constructor(
    private savedCitiesService: SavedCitiesService,
    private http: HttpClient
  ) { }

  getUpdates(): Observable<boolean>{
    return <Observable<boolean>> this.updated.asObservable();
  }
  closeSession(){
    //save to db favourite cities
    
    this.updated.next(false);
  }

  logIn(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    this.http.post(this.commonUrl + "/search",this.searchQuery(username),httpOptions).subscribe(res => {
      console.log(res);
      console.log(res.data[0].PASSWORD);
    });
    //emit an Observable with the true or false (login success)
    console.log("Logging in from the log service: username and psswd: " + username + " and " + password);
    //update favourite cities from saved cities service
    this.savedCitiesService.deleteCities();
    //save every city
    if(this.cities !== undefined){
     this.cities.forEach(city => {
        this.savedCitiesService.save(city);
      });
    } 

    this.updated.next(true);
    
  }

  searchQuery(username: string): string{

    return `{
      "filter": {
        "USERNAME": "` + username + `"
      },
      "columns":[ "USERNAME","PASSWORD","CITIES"]
     }`;
  }


}
