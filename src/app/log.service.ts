import { Injectable } from '@angular/core';
import { SavedCitiesService } from './saved-cities.service';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerResponse, ServedCity } from './servedCity';
import { UserServerRaw, UserServer, AuxServerData } from './userServer';
import { WeatherService } from './weather.service';
import { CitiesServerService } from './cities-server.service';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  cities : Array<SavedCity>;
  updated = new Subject();
  currentUser : UserServer;


  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/log/log";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';

  constructor(
    private savedCitiesService: SavedCitiesService,
    private http: HttpClient,
    private citiesServerService : CitiesServerService
  ) { }

  getUpdates(): Observable<boolean>{
    return <Observable<boolean>> this.updated.asObservable();
  }
  closeSession(){
    if(this.currentUser === undefined){
      this.updated.next(false);
      return;
    }
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    //save to db favourite cities
    this.currentUser.setFromList(this.savedCitiesService.getSavedCities());
    
    this.http.put(this.commonUrl,this.updateBody(),httpOptions).subscribe(rx => console.log(rx));

    this.savedCitiesService.deleteCities();
      this.updated.next(false);
  }

  updateBody(): string {
    return `{
      "filter": {
        "USERNAME": "` + this.currentUser.username + `"
      },
      "data": {
        "CITIES": "` + this.currentUser.favouriteCities + `"	
      }
     }`;
  }
   /*
   //Try to build a recursive function to make a unique query to the server
   while(leaves.length > 1){
    console.log(leaves.length);
    leaves = this.branch(leaves);
    console.log(leaves.length);
    }
    console.log(leaves.toString());
    this.updated.next(false);
  }

  branch(leaves : Array<string>): Array<string>{
    let aux = new Array<string>();
    let i = 0;
    if(leaves.length % 2 !== 0){
      //Make sure number of leaves is not odd
      leaves.push(leaves[0]);
    }
    for(i=0;i<=leaves.length-1;i=i+2){
      aux.push(`{"lop" : ` + leaves[i] + `,"op" : "OR", "rop" : ` + leaves[i+1] + ` }`);
      console.log(`{"lop" : ` + leaves[i] + `,"op" : "OR", "rop" : ` + leaves[i+1] + ` }`);
    }
    return aux;
  }*/

  logIn(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    this.http.post<AuxServerData>(this.commonUrl + "/search",this.searchQuery(username),httpOptions).subscribe(res => {
      this.currentUser = new UserServer(res);

      if(this.currentUser.password === password){
        this.savedCitiesService.deleteCities();
        this.citiesServerService.loadFavourites(this.currentUser.citiesId);
        this.updated.next(true);
      }else{
        this.updated.next(false);
      }
    });
    
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
