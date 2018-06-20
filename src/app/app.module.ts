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
import { GraphsComponent } from './graphs/graphs.component';

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { LogginDialogComponent } from './loggin-dialog/loggin-dialog.component';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { NewUserComponent } from './new-user/new-user.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';


@NgModule({ //Tells how to compile and launch the application
  declarations: [
    AppComponent,
    InitialComponent,
    CityComponent,
    NavigationComponent,
    GraphsComponent,
    LogginDialogComponent,
    NewUserComponent,
    SettingsComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MatDialogModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent], //root component that Angular inserts into the index.html host web page
  entryComponents: [LogginDialogComponent]
})
export class AppModule { }

