import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'app-loggin-dialog',
  templateUrl: './loggin-dialog.component.html',
  styleUrls: ['./loggin-dialog.component.css']
})
export class LogginDialogComponent implements OnInit {

  form : FormGroup;
  description: string;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<LogginDialogComponent>
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(20), Validators.required])],
      password: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(25), Validators.required])]
    })
  }

  submit(form){
    if(!this.form.valid){return;}
    console.log(this.form.value);
    this.dialogRef.close(this.form.value);
  }

}
