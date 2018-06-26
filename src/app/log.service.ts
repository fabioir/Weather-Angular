import { Injectable } from '@angular/core';
import { SavedCitiesService } from './saved-cities.service';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ServerResponse, ServedCity } from './servedCity';
import { UserServer, CitiesResponse, CitiesResponseUnit } from './userServer';
import { WeatherService } from './weather.service';
import { CitiesServerService } from './cities-server.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class LogService {


  cities: Array<SavedCity>;
  updated = new Subject();
  exists: Subject<boolean>;
  currentUser: UserServer; //Holds the info of the current logged user

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest/log/log";
  goodCommonUrl = "http://localhost:8080/citiesservice-server/services/rest";
  contentType = 'application/json';
  authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4OTU2OTY0MTE2LCJ1c2VybmFtZSI6ImRlbW8ifQ.xKAhjdQ9yEy2AuS8Dp3qtoBmEFL0wAclsK4LRmKZ9nE';

  constructor(
    private savedCitiesService: SavedCitiesService,
    private http: HttpClient,
    private citiesServerService: CitiesServerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }
  getToken(): string {
    return `${localStorage.getItem("Token")}`;
  }
  getUpdates(): Observable<boolean> {
    //Observable indicating if someone is logged in
    return <Observable<boolean>>this.updated.asObservable();
  }

  closeSession() {
    if (this.currentUser === undefined) {
      this.updated.next(false);
      return;
    }

    //save to string favourite cities
    this.currentUser.setFromList(this.savedCitiesService.getSavedCities());
    //save the cities that don`t exist yet in the server
    this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    this.citiesServerService.upload(this.currentUser.citiesList);


    this.updateUserCities() //New
    //this.updateSettings("CITIES", this.currentUser.favouriteCities); //To delete


    this.savedCitiesService.deleteCities();
    localStorage.removeItem("session");
    localStorage.removeItem("Token");
    this.updated.next(false);
    this.currentUser = undefined;
  }

  updateUserCities() {
    //New
    const body = `{
      "CITIES" : "` + this.currentUser.favouriteCities + `"
    }`;

    this.http.post(this.goodCommonUrl + "/fav/update", body).subscribe(res => { }, err => {
      console.log("There's been an error trying to update user's list of cities in the db");
      console.log(body);
    });
  }

  logIn(username: string, password: string) {
    let citiesList = "";
    //base64 coded
    let auth = "Basic " + btoa(`${username}:${password}`);


    this.http.post(this.goodCommonUrl + "/users/login", "", {
      headers: new HttpHeaders({
        'Authorization': auth
      }),
      observe: 'response'
    }).subscribe(res => {
      //Set the token
      localStorage.setItem("Token", "Bearer " + res.headers.get('X-Auth-Token'));

      //Get the favourite cities
      this.http.post<CitiesResponse>(`${this.goodCommonUrl}/fav/query`, "").subscribe(response => {
        //console.log(response.data[0].CITIES);
        //console.log(response);
        citiesList = response.data[0].CITIES;
        //Fill in the cities server service
        if (citiesList !== "") {
          this.citiesServerService.loadFavourites(citiesList.split(','));
        }

        localStorage.setItem("session", JSON.stringify(username));
        this.currentUser = new UserServer();

        this.currentUser.username = username;
        this.currentUser.password = `Bearer ${res.headers.get('X-Auth-Token')}`;
        this.currentUser.favouriteCities = citiesList;
        this.currentUser.citiesId = citiesList.split(',');
        this.currentUser.citiesList = this.savedCitiesService.getSavedCities();

        this.updated.next(true);
        //console.log(this.currentUser.display())
        this.snackBar.open("Logged as " + this.currentUser.username, "Ok", {
          duration: 1500
        });
      }, error => {
        console.log("Failure trying to obtain saved cities from the server");
      });



    }, err => {
      if(err.status === 401){
        this.snackBar.open( "Wrong password or username" , "Ok", {
          duration: 1500
        });
        console.log("Access denied");
      }else{
      console.log(`There's been a problem with your log in process.`);
      console.log(err);
      }
    });
  }


  logRefresh(){
    let citiesList = "";
    this.http.post<CitiesResponse>(`${this.goodCommonUrl}/fav/query`, "").subscribe(response => {
      //console.log(response.data[0].CITIES);
      //console.log(response);
      citiesList = response.data[0].CITIES;
      //Fill in the cities server service
      if (citiesList !== "") {
        this.citiesServerService.loadFavourites(citiesList.split(','));
      }

      let username = localStorage.getItem("session");
      this.currentUser = new UserServer();

      this.currentUser.username = username;
      this.currentUser.password = localStorage.getItem("Token");;
      this.currentUser.favouriteCities = citiesList;
      this.currentUser.citiesId = citiesList.split(',');
      this.currentUser.citiesList = this.savedCitiesService.getSavedCities();

      this.updated.next(true);
      //console.log(this.currentUser.display())
      this.snackBar.open("Logged as " + this.currentUser.username, "Ok", {
        duration: 1500
      });
    });
  }

  


  createUser(username: string, password: string){
    //Default Token for demo demouser. Don`t delete the demouser in the db because it would be complicated to create any other user afterwards
    localStorage.setItem("Token","Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4Nzk5MTY4MzgxLCJ1c2VybmFtZSI6ImRlbW8ifQ.vwEZijOag2iCSN0UPRTS8jqre1NGzHCrg6fVkDH2-mw")
    this.http.post(`${this.goodCommonUrl}/users/user`,`
    {
      "data": {
        "USER_": "${username}",
        "PASSWORD": "${password}",
        "NAME": "",
        "SURNAME": "",
        "EMAIL": "",
        "NIF" : ""
      }
      
     }
    `).subscribe(res => {
      //console.log(res)
      this.snackBar.open( `User ${username} successfully created`, "Ok", {
        duration: 2500
      });
      this.logIn(username,password);
    }, err =>{
      if(err.status === 500){
        this.snackBar.open( "This username is already in use", "Ok", {
          duration: 2500
        });
      }else{
        console.log("Something went wrong when creating the user");
      }
    });
  }
 
  
  

  

  deleteUser(user: UserServer) {
    let deleteBody = this.deleteBody(user.username);
    let bearer = localStorage.getItem("Token");
    this.closeSession();

    this.http.request(new HttpRequest("DELETE", `${this.goodCommonUrl}/users/user`, deleteBody, {
      headers: new HttpHeaders({
        'Content-Type': "application/json",
        'Authorization': bearer
      })
    })).subscribe(rx => {
      console.log("Deleted");
      this.snackBar.open( `The user has been deleted`, "Ok", {
        duration: 2500
      });
      this.router.navigate(['/initial']);
    });


  }
  deleteBody(username: string): string {
  //The service is always going to delete the current logged in user, no matter what the body contains
    return `{
       "filter": {
         "USER_": "` + username + `"
       }
      }`;
  }

  updatePassword(password: string){
    this.http.post(`${this.goodCommonUrl}/users/updatePassword`,`{ "PASSWORD" : "${password}"}`).subscribe(res => {
      this.snackBar.open( `Password changed`, "Ok", {
        duration: 2500
      });
    }, err => {
      console.log("Something went wrong when changing the password");
    });
  }
}
/* This service interacts with the Ontimize Server, with the service of users*/