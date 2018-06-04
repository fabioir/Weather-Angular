import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { InitialComponent } from './initial/initial.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
import { CityComponent } from './city/city.component';
import { NavigationComponent } from './navigation/navigation.component';

import { MaterialModule } from './material/material.module';
import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    CityComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
