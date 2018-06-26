import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogService } from '../log.service';
import { UserServer } from '../userServer';
import { SavedCitiesService } from '../saved-cities.service';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PasswordValidation } from '../new-user/new-user.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentUser: UserServer;
  logSubscription: Subscription;
  opened = true;
  formPassword: FormGroup;
  formDelete: FormGroup;
  valueTime = 1;
  pwd = true;
  deleteAccount = false;
  deleteAccount1 = false;


  constructor(
    private log: LogService,
    private savedCitiesService: SavedCitiesService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.setCurrentUser();

    this.isLogged();

    this.buildPsswdForm();

    this.buildDeleteForm();
  }
  ngOnDestroy() {
    this.logSubscription.unsubscribe();
  }

  setCurrentUser() {
    if (this.log.currentUser === undefined) {
      this.router.navigate(['initial']);
    } else {
      this.currentUser = this.log.currentUser;
      this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    }

  }
  buildPsswdForm() {
    //Form to change password
    this.formPassword = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])],
      password2: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }

  buildDeleteForm() {
    //Form to delete account
    this.formDelete = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    });
  }

  isLogged() {
    //If session expires or is closed redirect to home
    this.logSubscription = this.log.getUpdates().subscribe(logged => {
      if (!logged) {
        this.router.navigate(['initial']);
      }
    });
  }


  changePassword(passwd: string) {
    this.log.updateSettings("PASSWORD", passwd, true);
  }
  submitPassword() {
    if (this.formPassword.valid) {
      this.changePassword(this.formPassword.value.password);
      //Resets the form
      this.buildPsswdForm();
    }
  }


  submitDelete() {
    if (this.formDelete.valid) {
      let username = this.currentUser.username;
      this.log.logIn(username, this.formDelete.value.password);
      this.log.deleteUser(this.currentUser);
      
      console.log("Deleting user");

    }
  }



  //Methods to show different contents
  passwd() {
    this.pwd = true;
    this.deleteAccount = false;
    this.deleteAccount1 = false;
  }
  
  delAccnt() {
    this.pwd = false;
    this.deleteAccount = false;
    this.deleteAccount1 = true;
  }
  showDelete() {
    this.pwd = false;
    this.deleteAccount = true;
    this.deleteAccount1 = false;
  }
}
