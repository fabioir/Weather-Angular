import { Injectable } from '@angular/core';
import { SavedCitiesService } from './saved-cities.service';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerResponse, ServedCity } from './servedCity';
import { UserServerRaw, UserServer, AuxServerData } from './userServer';
import { WeatherService } from './weather.service';
import { CitiesServerService } from './cities-server.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  cities : Array<SavedCity>;
  updated = new Subject();
  exists : Subject<boolean>;
  currentUser : UserServer; //Holds the info of the current logged user

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/log/log";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';

  constructor(
    private savedCitiesService: SavedCitiesService,
    private http: HttpClient,
    private citiesServerService : CitiesServerService,
    private router : Router,
    private snackBar : MatSnackBar
  ) { }

  getUpdates(): Observable<boolean>{
    //Observable indicating if someone is logged in
    return <Observable<boolean>> this.updated.asObservable();
  }

  closeSession(){
    if(this.currentUser === undefined){
      this.updated.next(false);
      return;
    }
    
    //save to db favourite cities
    this.currentUser.setFromList(this.savedCitiesService.getSavedCities());
    // Here I should save the cities that don`t exist yet in the server
    localStorage.removeItem("session");
    localStorage.removeItem("expires");
    localStorage.removeItem("password");
    
    this.updateSettings("CITIES",this.currentUser.favouriteCities);
    

    this.savedCitiesService.deleteCities();
      this.updated.next(false);
  }


  logIn(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    this.http.post<AuxServerData>(this.commonUrl + "/search",this.searchQuery(username),httpOptions).subscribe(res => {
      if(res.data.length != 1){
        console.log("This user does not exist");//Or exists more than once (Impossible, USER is primary key)
        this.snackBar.open( "User does not exist: " + username, "Ok", {
          duration: 1500
        });
        return;
      }
      this.currentUser = new UserServer(res);

      if(this.currentUser.password === password){
        this.savedCitiesService.deleteCities();

        if(this.currentUser.citiesId[0] !== ""){
        this.citiesServerService.loadFavourites(this.currentUser.citiesId);
        }
        
        localStorage.setItem("session",JSON.stringify(this.currentUser.username));
        if(isNumber(this.currentUser.expirationTime)){
        localStorage.setItem("expires",JSON.stringify(new Date().getTime() + this.currentUser.expirationTime));
        }else{
          //Default expiration time: 1 minute
          localStorage.setItem("expires",JSON.stringify(new Date().getTime() + 60000));
          console.log("There has been a problem with expiration time: " + this.currentUser.expirationTime);
        }
        
        localStorage.setItem("password",JSON.stringify(this.currentUser.password));
        //Should it be a token?
        this.updated.next(true);
        this.snackBar.open( "Logged as " + this.currentUser.username, "Ok", {
          duration: 1500
        });
      }else{
        this.currentUser = undefined;
        this.updated.next(false);
        this.snackBar.open( "Wrong password", "Ok", {
          duration: 1500
        });
      }
    }, error => {
      console.log("Error trying to log in.");
    });
    
  }

  searchQuery(username: string): string{

    return `{
      "filter": {
        "USERNAME": "` + username + `"
      },
      "columns":[ "USERNAME","PASSWORD","CITIES","EXPIRES"]
     }`;
  }
  
  createUser(username: string, password: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };
    //first check if user exists
    this.http.post<AuxServerData>(this.commonUrl + "/search",this.searchQuery(username),httpOptions).subscribe(
      res => {
        //user exists
        if(res.data.length == 1){
        this.currentUser = new UserServer(res);
        console.log("this user exists");
        if(this.currentUser.username == username){
          this.snackBar.open("This username is not available", "Ok", {
            duration: 1500
          });
          this.currentUser = undefined;
          return;
        }
      }else{
        //User doesn't exist
        console.log(`user doesn't exist so we create it`);
        this.http.post(this.commonUrl,this.insertBody(username, password),httpOptions).subscribe(i => {
          //console.log(i);
          this.snackBar.open( "User created: " + username, "Ok", {
            duration: 1500
          });
          this.logIn(username,password)
          this.router.navigate(['initial']); 
        }, error =>{
            console.log("Error inserting new user to database");
            return;
          });
      }
      }, error => {
        console.log("Error searching user in database");
        return;
      });
  }
  insertBody(username: string, password: string){
    return `
    {
      "data" : {
        "USERNAME": "` + username + `",
        "PASSWORD": "` + password + `",
        "CITIES": "",
        "EXPIRES": 60000
        }
     }`;
  }

  updateSettings(paramName: string, value: string, settings?){

    const params = ["USERNAME", "PASSWORD", "CITIES", "EXPIRES"];

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  this.contentType,
        'Authorization': this.authorization
      })
    };

    if(params.includes(paramName)){
      if(paramName !== "EXPIRES"){
        value = `"` + value + `"`;
      }
      this.http.put(this.commonUrl,this.updateBody(this.currentUser.username, paramName, value),httpOptions).subscribe(rx => {
        if(settings){
          let text = paramName;
          switch(paramName){
            case "PASSWORD":
            text = "Password successfully"
            break;

            case "EXPIRES":
            text = "Expiration time successfully"
            break;

            default:
            break;
          }
        this.snackBar.open( text + " changed", "Ok", {
          duration: 1500
        });
        }
      }, error=>{
        console.log("There has been a problen updating settings. \nbody: " + this.updateBody(this.currentUser.username, paramName, value));

      });

    }else{
      console.log(paramName + " is not included");
    }

  }

  updateBody(username: string, param: string, data: string): string{

   return`{
      "filter": {
        "USERNAME": "` + username + `"
      },
      "data": {
        "` + param + `": ` + data + `	
      }
     }`;
  }
  

}
/* This service interacts with the Ontimize Server, with the service of users*/