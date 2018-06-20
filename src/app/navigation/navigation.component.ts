import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
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
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
    clearInterval(this.intervalCheck);
  }

  checkExpiration() {
    let time = JSON.parse(localStorage.getItem("expires"));
    if(((new Date().getTime())>time)&&(time !== null)){
      console.log("Problem with expiration time: " + time);
      this.toggleSession();
      localStorage.removeItem("session");
      localStorage.removeItem("password");
      localStorage.removeItem("expires");
      localStorage.removeItem("favouriteCities");
      window.alert("Session has expired");
    }


    if(((new Date().getTime())<time)&&(time !== null)&&!this.logged){
      //Log when refreshing
      let username = JSON.parse(localStorage.getItem("session"));
      let password = JSON.parse(localStorage.getItem("password"));
      this.logService.logIn(username,password);
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
      this.profile = this.logService.currentUser.username;
      if((this.savedCities.length < 1) && this.opened){
        this.toggleFavourites();
      }
    });
  }

  getCities() {
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
    this.dialogRef = this.dialog.open(LogginDialogComponent);

    this.dialogRef.afterClosed().subscribe(data => {
      //when dialog is closed we try the session with the service's method
      if(data !== undefined){
      if(data.username !== undefined || data.password !== undefined){
      this.logService.logIn(data.username,data.password)
      }
    }
    });

  }

  
}


/*
This component picks the saved cities from the SavedCitiesService and displays the links to city/cod

*/ 