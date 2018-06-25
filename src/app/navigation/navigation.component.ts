import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SavedCitiesService } from '../saved-cities.service';
import { SavedCity } from '../savedCity';
import { ActivatedRoute, Route } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogginDialogComponent } from '../loggin-dialog/loggin-dialog.component';
import { LogService } from '../log.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  savedCities: SavedCity[];
  routeSubscription: Subscription;
  citiesSubscription: Subscription;
  logSubscription: Subscription;
  logSubscription2: Subscription;
  @Input() opened: boolean = false;
  notEmpty = false;
  emptyList = 'none';
  dialogRef: MatDialogRef<LogginDialogComponent>;
  logged = false;
  profile: string = "";
  intervalCheck;
  youSureButton = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private savedCitiesService: SavedCitiesService,
    private logService: LogService,
    public dialog: MatDialog,
    private snackBar : MatSnackBar
  ) {
    //Trying to listen to a change in the path to refresh info
    this.routeSubscription = this.route.params.subscribe((value: PopStateEvent) => {
      this.getCities();
      this.relog();
    });
  }

  ngOnInit() {
    this.getCities();
    this.getLog();
    
  }


  ngOnDestroy() {
    //Unsubscribe from Observables to avoid inefficiency
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
  }

  relog() {
    let username = JSON.parse(localStorage.getItem("session"));
    let password = JSON.parse(localStorage.getItem("password"));
    if ((username !== null) && (password != null)) {
      this.logService.logIn(username, password);
    }
  }




  getLog() {
    this.logSubscription = this.logService.getUpdates().subscribe(logged => {
      this.logged = logged;
      this.profile = this.logService.currentUser.username; //For showing settings
      if ((this.savedCities.length < 1) && this.opened) {
        this.toggleFavourites();
      }
    });
  }

  getCities() {
    //Asks the savedCities service to load the cities in the localhost
    this.savedCities = this.savedCitiesService.getSavedCities();
    this.citiesSubscription = this.savedCitiesService.getUpdates().subscribe(cities => {

      this.savedCities = cities;
      if (cities.length > 0) {
        this.notEmpty = true;
        this.emptyList = 'none';
      } else {
        this.notEmpty = false;
      }
    });
  }

  toggleFavourites() {
    if(this.youSureButton){
      this.youSureButton = false;
    }
    if (this.notEmpty) {
      this.opened = !this.opened;
      this.emptyList = 'none';
    } else {
      this.opened = false;
      this.emptyList = 'block';
    }
  }

  deleteCities() {
    this.youSureButton = false;
    this.savedCitiesService.deleteCities();
    this.getCities();
    this.opened = false;
    this.notEmpty = false;
    this.snackBar.open("Favourite cities have been deleted", "Ok");
  }

  youSure(){
    this.youSureButton = true; //Activates the button to deleteCities()
  }
  notSure(){
    this.youSureButton = false;
  }

  toggleSession() {

    if (this.logged) {
      this.logService.closeSession();
      this.deleteCities();
      return;
    }
    //Opens a dialog ref with a form to log in
    this.dialogRef = this.dialog.open(LogginDialogComponent);

    this.dialogRef.afterClosed().subscribe(data => {
      //when dialog is closed we try the session with the service's method
      if (data !== undefined) {
        if (data.username !== undefined || data.password !== undefined) {
          this.logService.logIn(data.username, data.password); //Call the log service
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