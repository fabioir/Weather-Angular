import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: 'app-loggin-dialog',
  templateUrl: './loggin-dialog.component.html',
  styleUrls: ['./loggin-dialog.component.css']
})
export class LogginDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  username: string;
  password: string;
  minLengthError = false;
  maxLengthError = false;
  passwordRequiredError = false;
  usernameRequiredError = false;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LogginDialogComponent>,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(this.username, [Validators.minLength(4), Validators.maxLength(20), Validators.required]),
      password: new FormControl(this.password, [Validators.required])
    });
    
  }
  
  submit() {
    this.checkErrors();
    if (!this.form.valid) { return; }
    this.dialogRef.close(this.form.value);
  }

  checkErrors(){
    this.minLengthError = this.maxLengthError = this.passwordRequiredError = this.usernameRequiredError = false;
    if(this.form.get('username').errors !== null){
      if(this.form.get('username').errors.minlength !== undefined){
        this.minLengthError = true;
      }
      if(this.form.get('username').errors.maxLength !== undefined){
        this.maxLengthError = true;
      }
      if(this.form.get('username').errors.required !== undefined){
        this.usernameRequiredError = true;
      }
    }

    if(this.form.get('password').errors !== null){
      if(this.form.get('password').errors.required !== undefined){
        this.passwordRequiredError = true;
      }
    }
  }

  newUser() {
    this.dialogRef.close();
    this.router.navigate(['user']);
  }
}

/* This log in dialog pops up when the sign in button in the navigation bar is clicked.

It just launches a form, validates it and returns the data when closed.

Also, contains a button that routes to the user creation functionality*/
