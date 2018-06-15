import { Component, OnInit, OnDestroy, Input} from '@angular/core';
import  { SavedCitiesService } from '../saved-cities.service';
import { SavedCity } from '../savedCity';
import { ActivatedRoute, Route } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogginDialogComponent } from '../loggin-dialog/loggin-dialog.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit, OnDestroy {

  savedCities : SavedCity[];
  routeSubscription : Subscription;
  citiesSubscription : Subscription;
  @Input() opened: boolean = false;
  notEmpty = false;
  emptyList = 'none';
  dialogRef: MatDialogRef<LogginDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private savedCitiesService: SavedCitiesService,
    public dialog: MatDialog
  ) {
     //Trying to listen to a change in the path to refresh info
     this.routeSubscription = this.route.params.subscribe((value: PopStateEvent) => {
      this.getCities();
    });  
   }

  ngOnInit() {
    this.getCities();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.citiesSubscription.unsubscribe();
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
    this.dialogRef = this.dialog.open(LogginDialogComponent/*, {
      height: '50%',
      width: '50%',
      autoFocus: true
    }*/);

    /*this.dialogRef.afterClosed().subscribe(data => {
      console.log("Dialog data when closed " + data)
      this.logIn();
    });*/
  }

  logIn() {
    console.log("Loggin in function");
  }
}


/*
This component picks the saved cities from the SavedCitiesService and displays the links to city/cod

*/ 