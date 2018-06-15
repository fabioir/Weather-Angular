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
  @Input() opened: boolean = false;
  notEmpty = false;
  emptyList = 'none';
  dialogRef: MatDialogRef<LogginDialogComponent>;
  logged = false;

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
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
    this.logSubscription.unsubscribe();
  }

  getLog() {
    this.logSubscription = this.logService.getUpdates().subscribe(logged => {
      this.logged = logged;
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
      console.log("log out");
      
      //must update cities list in db
      //as there is no session cities have not been saved
      this.logService.closeSession();
      this.deleteCities();
      return;
    }
    //this.logged = true;
    this.dialogRef = this.dialog.open(LogginDialogComponent/*, {
      height: '50%',
      width: '50%',
      autoFocus: true
    }*/);

    this.dialogRef.afterClosed().subscribe(data => {
      console.log("Dialog data when closed " + data.logged)
      this.logService.logIn(data.username,data.password)
     
    });

  }

  
}


/*
This component picks the saved cities from the SavedCitiesService and displays the links to city/cod

*/ 