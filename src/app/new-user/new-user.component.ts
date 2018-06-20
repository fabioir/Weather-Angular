import { Component, OnInit } from '@angular/core';
import { UserServer } from '../userServer';
import {Router} from "@angular/router";
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LogService } from '../log.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  
  password2 : string;
  form : FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private logService: LogService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(20), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])],
      password2: ['',Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    },{
      validator: PasswordValidation.MatchPassword
    })
  }

  submit(){
    if(this.form.valid){
      this.logService.createUser(this.form.value.username, this.form.value.password);
      
    } else {
      console.log("Not valid");
    }
  }
}

export class PasswordValidation {

  static MatchPassword(AC: AbstractControl){
    let p1 = AC.get('password');
    let p2 = AC.get('password2');
    //console.log(p1.value + " " + p2.value);
    if(p1.value != p2.value) {
      AC.get('password2').setErrors( {MatchPassword: true} )
  } else {
      return null
  }

  }
}