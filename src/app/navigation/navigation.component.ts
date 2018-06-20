import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import  { SavedCitiesService } from '../saved-cities.service';
import { SavedCity } from '../savedCity';
import { ActivatedRoute, Route } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogginDialogComponent } from '../loggin-dialog/loggin-dialog.component';
import { LogService } from '../log.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  savedCities : SavedCity[];
  routeSubscription : Subscription;
  citiesSubscription : Subscription;
  logSubscription : Subscription;
  logSubscription2 : Subscription;
  @Input() opened: boolean = false;
  notEmpty = false;
  emptyList = 'none';
  dialogRef: MatDialogRef<LogginDialogComponent>;
  logged = false;
  profile : string = "";
  intervalCheck;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private savedCitiesService: SavedCitiesService,
    private logService: LogService,
    public dialog: MatDialog
  ) {
     //Trying to listen to a change in the path to refresh info
     this.routeSubscription = this.route.params.subscribe((value: PopStateEvent) => {
      this.getCities();
    });  
   }

  ngOnInit() {
    this.getCities();
    this.getLog();
    this.intervalCheck  = setInterval(() => {    if(this.logged){this.checkExpiration()}; this.getCities();  },5000); //Periodically executes these functions
  }


  ngOnDestroy() {
    //Unsubscribe from Observables to avoid inefficiency
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
    //End the interval
    clearInterval(this.intervalCheck);
  }

  checkExpiration() {
    //Checks if the session has expired and logs out if it has
    let time = JSON.parse(localStorage.getItem("expires"));
    if(((new Date().getTime())>time)&&(time !== null)){
      console.log("Problem with expiration time: " + time); //Sometimes doesn't work properly
      this.toggleSession();
      localStorage.removeItem("session");
      localStorage.removeItem("password");
      localStorage.removeItem("expires");
      localStorage.removeItem("favouriteCities");
      window.alert("Session has expired");
    }


    if(((new Date().getTime())<time)&&(time !== null)&&!this.logged){
      //Log in when refreshing if time has not expired and session was not closed
      let username = JSON.parse(localStorage.getItem("session"));
      let password = JSON.parse(localStorage.getItem("password"));
      this.logService.logIn(username,password);
      //Sets the previous expiration time to avoid restarting the count
      this.logSubscription2 = this.logService.getUpdates().subscribe(logged => {
        if(logged){
      localStorage.setItem("expires",time);
        }
    });
    }
    
  }

  
  


  getLog() {
    this.logSubscription = this.logService.getUpdates().subscribe(logged => {
      this.logged = logged;
      this.profile = this.logService.currentUser.username; //For showing settings
      if((this.savedCities.length < 1) && this.opened){
        this.toggleFavourites();
      }
    });
  }

  getCities() {
    //Asks the savedCities service to load the cities in the localhost
    this.savedCities = this.savedCitiesService.getSavedCities();
    this.citiesSubscription = this.savedCitiesService.getUpdates().subscribe(cities => {
      
      this.savedCities = cities;
      if (cities.length > 0){
        this.notEmpty = true;
        this.emptyList = 'none';
      }else{
        this.notEmpty = false;
      }
    });
  }

  toggleFavourites() {
    if(this.notEmpty){
    this.opened = !this.opened;
    this.emptyList = 'none';
    }else{
      this.opened = false;
      this.emptyList = 'block';
    }
  }

  deleteCities() {
    this.savedCitiesService.deleteCities();
    this.getCities();
    this.opened = false;
    this.notEmpty = false;
  }

  toggleSession() {

    if(this.logged){
      this.logService.closeSession();
      this.deleteCities();
      return;
    }
    //Opens a dialog ref with a form to log in
    this.dialogRef = this.dialog.open(LogginDialogComponent);

    this.dialogRef.afterClosed().subscribe(data => {
      //when dialog is closed we try the session with the service's method
      if(data !== undefined){
      if(data.username !== undefined || data.password !== undefined){
      this.logService.logIn(data.username,data.password); //Call the log service
      }
    }
    });

  }

  
}


/*
This component picks the saved cities from the SavedCitiesService and displays the links to city/cod in a sidenav that can be hidden

Also, presents a link to the inicial view and a menu with the options to log in, settings and about.

Logged in indicator (Check icon).
*/ 