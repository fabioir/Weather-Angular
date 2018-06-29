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

/**This component shows the settings that can be changed for the current user and asks the log service to perform such changes */
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

  /**Gets the info about the current user and navigates to home if there isn'n any user */
  setCurrentUser() {
    if (this.log.currentUser === undefined) {
      this.router.navigate(['initial']);
    } else {
      this.currentUser = this.log.currentUser;
      this.currentUser.citiesList = this.savedCitiesService.getSavedCities();
    }

  }


  /**Builds the form to change password with its validators */
  buildPsswdForm() {
    this.formPassword = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])],
      password2: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }

  /**Builds the Form to delete account (asks for the password)*/
  buildDeleteForm() {
    this.formDelete = this.formBuilder.group({
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    });
  }

  /**If session is closed redirect to home*/
  isLogged() {
    this.logSubscription = this.log.getUpdates().subscribe(logged => {
      if (!logged) {
        this.router.navigate(['initial']);
      }
    });
  }

  /**Asks log service to update the password */
  changePassword(passwd: string) {
    this.log.updatePassword(passwd);
  }

  /**If the password change form is valid executes changePassword() */
  submitPassword() {
    if (this.formPassword.valid) {
      this.changePassword(this.formPassword.value.password);
      //Resets the form
      this.buildPsswdForm();
    }
  }

  /**If the delete account form is valid asks log service to delete the account  */
  submitDelete() {
    if (this.formDelete.valid) {
      let username = this.currentUser.username;
      this.log.closeSession();
      this.log.deleteUser(username, this.formDelete.value.password);
    }
  }

  //Methods to show different contents

  /**Shows changing password form */
  passwd() {
    this.pwd = true;
    this.deleteAccount = false;
    this.deleteAccount1 = false;
  }

  /**Shows deleting account confirmation form */
  delAccnt() {
    this.pwd = false;
    this.deleteAccount = false;
    this.deleteAccount1 = true;
  }

  /**Shows deleting account options */
  showDelete() {
    this.pwd = false;
    this.deleteAccount = true;
    this.deleteAccount1 = false;
  }
}