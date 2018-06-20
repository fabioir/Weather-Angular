import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log.service';
import { UserServer } from '../userServer';
import { SavedCitiesService } from '../saved-cities.service';
import {Router} from "@angular/router";
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../new-user/new-user.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser : UserServer;
  logSubscription : Subscription;
  opened = true;
  formPassword : FormGroup;
  valueTime = 1;
  pwd = true;
  time = false;


  constructor(
    private log : LogService,
    private savedCitiesService : SavedCitiesService,
    private router: Router,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit() {
    if(this.log.currentUser === undefined){
      this.router.navigate(['initial']); 
    }else{
    this.currentUser = this.log.currentUser;
    this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    }
    this.getLog();

    this.buildPsswdForm();
  }
  ngOnDestroy () {
    this.logSubscription.unsubscribe();
  }

  buildPsswdForm(){
    this.formPassword = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])],
      password2: ['',Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    },{
      validator: PasswordValidation.MatchPassword
    })
  }
  submitPassword(){
    if(this.formPassword.valid){
      this.changePassword(this.formPassword.value.password);
    }
  }

  submitTime(){
    this.log.updateSettings("EXPIRES", (this.valueTime * 60 * 1000).toString(),true);
  }
  getLog() {
    //If session expires or is closed redirect to home
    this.logSubscription = this.log.getUpdates().subscribe(logged => {
      if(!logged){
        this.router.navigate(['initial']); 
      }
    });
  }

  changePassword(passwd: string){
    this.log.updateSettings("PASSWORD", passwd, true);
  }

  passwd(){
    this.pwd = true;
    this.time = false;
  }
  exprtn(){
    this.pwd = false;
    this.time = true;
  }
}
