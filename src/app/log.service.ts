import { Injectable } from '@angular/core';
import { SavedCitiesService } from './saved-cities.service';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { UserServer, CitiesResponse } from './userServer';
import { CitiesServerService } from './cities-server.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})

/** This service interacts with the Ontimize Server, with the service of users*/
export class LogService {


  cities: Array<SavedCity>;
  updated = new Subject();
  exists: Subject<boolean>;
  currentUser: UserServer; //Holds the info of the current logged user

  commonUrl = "http://localhost:8080/citiesservice-server/services/rest";
  contentType = 'application/json';

  constructor(
    private savedCitiesService: SavedCitiesService,
    private http: HttpClient,
    private citiesServerService: CitiesServerService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  /**Returns the Token from localStorage */
  getToken(): string {
    return `${localStorage.getItem("Token")}`;
  }

  /**Observable indicating if someone is logged in*/
  getUpdates(): Observable<boolean> {
    return <Observable<boolean>>this.updated.asObservable();
  }

  /**Saves the cities to the server and closes session */
  closeSession() {
    //Should invalidate the token in the server, yet to do
    if (this.currentUser === undefined) {
      this.updated.next(false);
      return;
    }

    //save to string favourite cities
    this.currentUser.setFromList(this.savedCitiesService.getSavedCities());
    //save the cities that don`t exist yet in the server
    this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    this.citiesServerService.upload(this.currentUser.citiesList);

    this.updateUserCities() //creates the request body and sends it
    //Remove session data
    this.savedCitiesService.deleteCities();
    localStorage.removeItem("session");
    localStorage.removeItem("Token");
    this.updated.next(false);
    this.currentUser = undefined;
  }

  /**Returns the cities update request body and sends it */
  updateUserCities() {
    const body = `{
      "CITIES" : "` + this.currentUser.favouriteCities + `"
    }`;

    this.http.post(`${this.commonUrl}/fav/update`, body).subscribe(() => { }, err => {
      console.log("There's been an error trying to update user's list of cities in the db");
      console.log(body);
    });
  }

  /**Asks the server for the user information and stores it to the app memory (currentUser and localStorage) */
  logIn(username: string, password: string) {
    let citiesList = "";
    //base64 coded
    let auth = "Basic " + btoa(`${username}:${password}`);


    this.http.post(`${this.commonUrl}/users/login`, "", {
      headers: new HttpHeaders({
        'Authorization': auth
      }),
      observe: 'response'
    }).subscribe(res => {
      //Set the token
      localStorage.setItem("Token", "Bearer " + res.headers.get('X-Auth-Token'));

      //Get the favourite cities
      this.http.post<CitiesResponse>(`${this.commonUrl}/fav/query`, "").subscribe(response => {

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
      if (err.status === 401) {
        this.snackBar.open("Wrong password or username", "Ok", {
          duration: 1500
        });
        console.log("Access denied");
      } else {
        console.log(`There's been a problem with your log in process.`);
        console.log(err);
      }
    });
  }

  /**Gets back user info in case it is available (the session has not been closed) */
  logRefresh() {
    let citiesList = "";
    this.http.post<CitiesResponse>(`${this.commonUrl}/fav/query`, "").subscribe(response => {

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
      this.snackBar.open("Logged as " + this.currentUser.username, "Ok", {
        duration: 1500
      });
    });
  }

  /**Creates a new user using demo demouser token */
  createUser(username: string, password: string) {
    //Default Token for demo demouser. Don`t delete the demouser in the db because it would be complicated to create any other user afterwards
    localStorage.setItem("Token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGlvbi10aW1lIjoxNTI4Nzk5MTY4MzgxLCJ1c2VybmFtZSI6ImRlbW8ifQ.vwEZijOag2iCSN0UPRTS8jqre1NGzHCrg6fVkDH2-mw")
    this.http.post(`${this.commonUrl}/users/user`, `
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
        this.snackBar.open(`User ${username} successfully created`, "Ok", {
          duration: 2500
        });
        this.logIn(username, password);
      }, err => {
        if (err.status === 500) {
          this.snackBar.open("This username is already in use", "Ok", {
            duration: 2500
          });
        } else {
          console.log("Something went wrong when creating the user");
        }
      });
  }






  deleteUser(username: string, password: string) {
    /**Asks the server to delete the user corresponding to the username and password in the input */
    let deleteBody = this.deleteBody(username);
    let basic = 'Basic ' + btoa(`${username}:${password}`);

    this.http.request(new HttpRequest("DELETE", `${this.commonUrl}/users/user`, deleteBody, {
      headers: new HttpHeaders({
        'Content-Type': "application/json",
        'Authorization': basic
      })
    })).subscribe(() => {
      this.snackBar.open(`The user has been deleted`, "Ok", {
        duration: 2500
      });
      this.router.navigate(['/initial']);
    });


  }

  deleteBody(username: string): string {
    /**The service is always going to delete the current logged in user, no matter what the body contains*/
    return `{
       "filter": {
         "USER_": "` + username + `"
       }
      }`;
  }

  updatePassword(password: string) {
    /**Updates current user password */
    this.http.post(`${this.commonUrl}/users/updatePassword`, `{ "PASSWORD" : "${password}"}`).subscribe(() => {
      this.snackBar.open(`Password changed`, "Ok", {
        duration: 2500
      });
    }, () => {
      console.log("Something went wrong when changing the password");
    });
  }
}