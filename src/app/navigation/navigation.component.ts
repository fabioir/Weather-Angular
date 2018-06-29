import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SavedCitiesService } from '../saved-cities.service';
import { SavedCity } from '../savedCity';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LogginDialogComponent } from '../loggin-dialog/loggin-dialog.component';
import { LogService } from '../log.service';
import { MatSnackBar } from '@angular/material';

import { Router } from '@angular/router';
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
/**This component picks the saved cities from the SavedCitiesService and displays the links to city/cod in a sidenav that can be hidden

Also, presents a link to the inicial view and a menu with the options to log in, settings and about.

Logged in indicator (Check icon).*/
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
    private router: Router,
    private savedCitiesService: SavedCitiesService,
    private logService: LogService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    //listening to changes in the url to remove background image
    router.events.subscribe(() => {
      if (!(this.router.url.includes(`/initial`))) {
        const body = document.getElementsByTagName("body");
        body[0].classList.remove("initial-view");
      }
    });
  }


  /**Initial tasks */
  ngOnInit() {
    this.relog();
    this.getCities();
    this.getLog();
  }


  /**Unsubscribe from Observables to avoid inefficiency*/
  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
  }

  /**If there is a available token tries to restore session */
  relog() {
    let token = localStorage.getItem("Token");
    this.profile = localStorage.getItem("session");
    if ((token !== null) && (this.profile != null)) {
      this.profile = this.profile.replace(/['"]+/g, '');
      localStorage.setItem("session", this.profile);
      this.logService.logRefresh();
    }
  }

  /**Subscribes to changes in the current user from the log service observable */
  getLog() {
    this.logSubscription = this.logService.getUpdates().subscribe(logged => {
      this.logged = logged;
      if (this.logService.currentUser === undefined) {
        this.profile = "USER";
      } else {
        this.profile = this.logService.currentUser.username.replace(/['"]+/g, ''); //For showing settings
      }
      if ((this.savedCities.length < 1) && this.opened) {
        this.toggleFavourites();
      }
    });
  }

  /**Asks the savedCities service to load the cities in the localhost and updates the saved cities list*/
  getCities() {
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

  /**Shows (if available) or hides the favourites sidenav */
  toggleFavourites() {
    if (this.youSureButton) {
      //Hides confirming deleted button
      this.youSureButton = false;
    }
    if (this.notEmpty) {
      this.opened = !this.opened;
      this.emptyList = 'none';
    } else {
      //Not shown without cities
      this.opened = false;
      this.emptyList = 'block';
    }
  }

  /**Asks cities service to delete de list and updates its own */
  deleteCities() {
    this.youSureButton = false;
    this.savedCitiesService.deleteCities();
    this.getCities();
    this.opened = false;
    this.notEmpty = false;
    this.snackBar.open("Favourite cities have been deleted", "Ok", { duration: 3000 });
  }

  /**Shows the confirmation option to delete the cities list */
  youSure() {
    this.youSureButton = true; //Activates the button to deleteCities()
  }

  /**Cancels deletion of cities list */
  notSure() {
    this.youSureButton = false;
  }

  /**Closes session if logged in, shows dialog component to log in if there isn't a current running session*/
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