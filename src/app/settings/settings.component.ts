import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log.service';
import { UserServer } from '../userServer';
import { SavedCitiesService } from '../saved-cities.service';
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser : UserServer;
  logSubscription : Subscription;

  constructor(
    private log : LogService,
    private savedCitiesService : SavedCitiesService,
    private router: Router
  ) { }

  ngOnInit() {
    if(this.log.currentUser === undefined){
      this.router.navigate(['initial']); 
    }else{
    this.currentUser = this.log.currentUser;
    this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    }
    this.getLog();
  }
  ngOnDestroy () {
    this.logSubscription.unsubscribe();
  }

  getLog() {
    this.logSubscription = this.log.getUpdates().subscribe(logged => {
      if(!logged){
        this.router.navigate(['initial']); 
      }
    });
  }

}
