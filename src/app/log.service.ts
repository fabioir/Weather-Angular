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

    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': auth,
      }),
      observe: 'body'
    };

    this.http.post(this.goodCommonUrl + "/users/login", "", {
      headers: new HttpHeaders({
        'Authorization': auth
      }),
      observe: 'response'
    }).subscribe(res => {
      //Set the token
      localStorage.setItem("Token", "Bearer " + res.headers.get('X-Auth-Token'));

      //Get the favourite cities
      const citiesString = this.http.post<CitiesResponse>(`${this.goodCommonUrl}/fav/query`, "").subscribe(response => {
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



  /*logIn(username: string, password: string){
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
    
  }*/

  searchQuery(username: string): string {

    return `{
      "filter": {
        "USERNAME": "` + username + `"
      },
      "columns":[ "USERNAME","PASSWORD","CITIES","EXPIRES"]
     }`;
  }
  createUser(username: string, password: string){
    //Default Token for demo demouser
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
  /*createUser(username: string, password: string){
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
  }*/
  insertBody(username: string, password: string) {
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

  updateSettings(paramName: string, value: string, settings?) {

    const params = ["USERNAME", "PASSWORD", "CITIES", "EXPIRES"];

    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': this.contentType,
        'Authorization': this.authorization
      })
    };

    if (params.includes(paramName)) {
      if (paramName !== "EXPIRES") {
        value = `"` + value + `"`;
      }
      this.http.put(this.commonUrl, this.updateBody(this.currentUser.username, paramName, value), httpOptions).subscribe(rx => {
        if (settings) {
          let text = paramName;
          switch (paramName) {
            case "PASSWORD":
              text = "Password successfully"
              break;

            case "EXPIRES":
              text = "Expiration time successfully"
              break;

            default:
              break;
          }
          this.snackBar.open(text + " changed", "Ok", {
            duration: 1500
          });
        }
      }, error => {
        console.log("There has been a problen updating settings. \nbody: " + this.updateBody(this.currentUser.username, paramName, value));

      });

    } else {
      console.log(paramName + " is not included");
    }

  }

  updateBody(username: string, param: string, data: string): string {

    return `{
      "filter": {
        "USERNAME": "` + username + `"
      },
      "data": {
        "` + param + `": ` + data + `	
      }
     }`;
  }

  deleteUser(user: UserServer) {

    let deleteBody = this.deleteBody(user.username);
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': this.contentType,
        'Authorization': this.authorization
      })
    };
    this.closeSession();

    this.http.request(new HttpRequest("DELETE", this.commonUrl, deleteBody, {
      headers: new HttpHeaders({
        'Content-Type': this.contentType,
        'Authorization': this.authorization
      })
    })).subscribe(rx => {
      console.log("Deleted");

      this.router.navigate(['/initial']);
    });


  }
  deleteBody(username: string): string {

    return `{
       "filter": {
         "USERNAME": "` + username + `"
       }
      }`;
  }

}
/* This service interacts with the Ontimize Server, with the service of users*/