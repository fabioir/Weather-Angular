import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LogService } from '../log.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
/** This component simply launches a form to ask the log service to create a new user with the info adquired in the form */
export class NewUserComponent implements OnInit {


  password2: string;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private logService: LogService
  ) { }

  ngOnInit() {
    this.launchForm();
  }

  /**Creates the form with its Validators*/
  launchForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(20), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])],
      password2: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  /**Checks if the form is valid and asks the log service to create a new user */
  submit() {
    if (this.form.valid) {

      this.logService.createUser(this.form.value.username, this.form.value.password);

    } else {
      console.log("Form values not valid");
    }
  }
}

/**Validates that the password has been repeated correctly*/
export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    let p1 = AC.get('password');
    let p2 = AC.get('password2');
    if (p1.value != p2.value) {
      AC.get('password2').setErrors({ MatchPassword: true })
    } else {
      return null
    }

  }
}