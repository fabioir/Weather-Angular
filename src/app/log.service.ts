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

@Injectable({
  providedIn: 'root'
})
export class LogService {


  cities : Array<SavedCity>;
  updated = new Subject();
  exists : Subject<boolean>;
  currentUser : UserServer;
  //snackBar : MatSnackBar;

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
    return <Observable<boolean>> this.updated.asObservable();
  }
  closeSession(){
    if(this.currentUser === undefined){
      this.updated.next(false);
      return;
    }
    
    //save to db favourite cities
    this.currentUser.setFromList(this.savedCitiesService.getSavedCities());

    localStorage.removeItem("session");
    localStorage.removeItem("expires");
    localStorage.removeItem("password");
    
    this.updateSettings("CITIES",this.currentUser.favouriteCities);
    /*this.http.put(this.commonUrl,this.updateCitiesBody(),httpOptions).subscribe(rx => {}, error=>{
      console.log("There has been a problen closing session.");
    });*/

    this.savedCitiesService.deleteCities();
      this.updated.next(false);
  }

  /*updateCitiesBody(): string {
    return `{
      "filter": {
        "USERNAME": "` + this.currentUser.username + `"
      },
      "data": {
        "CITIES": "` + this.currentUser.favouriteCities + `"	
      }
     }`;
  }*/
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
      if(res.data.length != 1){
        console.log("This user does not exist");
        return;
      }
      this.currentUser = new UserServer(res);

      if(this.currentUser.password === password){
        this.savedCitiesService.deleteCities();

        if(this.currentUser.citiesId[0] !== ""){
        this.citiesServerService.loadFavourites(this.currentUser.citiesId);
        }
        
        localStorage.setItem("session",JSON.stringify(this.currentUser.username));
        localStorage.setItem("expires",JSON.stringify(new Date().getTime() + (this.currentUser.expirationTime)||60000));
        
        localStorage.setItem("password",JSON.stringify(this.currentUser.password));
        this.updated.next(true);
        this.snackBar.open( "Logged as " + this.currentUser.username, "Ok", {
          duration: 1500
        });
      }else{
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
