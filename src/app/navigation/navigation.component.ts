import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import  { SavedCitiesService } from '../saved-cities.service';
import { SavedCity } from '../savedCity';
import { ActivatedRoute, Route } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private savedCitiesService: SavedCitiesService
  ) {
     //Trying to listen to a change in the path to refresh info
     this.routeSubscription = this.route.params.subscribe((value: PopStateEvent) => {
      console.log('Added to favourites');
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
      console.log("The subscription is working");

    });
  }

  toggleFavourites() {
    this.opened = !this.opened;
    console.log(this.opened);
  }

}

/*
This component picks the saved cities from the SavedCitiesService and displays the links to city/cod

*/ 