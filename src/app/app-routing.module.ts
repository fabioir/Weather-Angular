import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { InitialComponent } from './initial/initial.component';
import { CityComponent } from './city/city.component';

const routes: Routes = [
  { path: '', redirectTo: '/initial', pathMatch: 'full' },
  { path: 'initial', component: InitialComponent },
  { path: 'city/:id/:name', component: CityComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
/*
This is the routing module. It is responsible for the navigation across the different components, redirecting the application to the right one for each URL.
*/