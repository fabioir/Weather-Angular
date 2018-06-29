import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialComponent } from './initial/initial.component';
import { CityComponent } from './city/city.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { GraphsComponent } from './graphs/graphs.component';
import { NewUserComponent } from './new-user/new-user.component';
import { SettingsComponent } from './settings/settings.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
  { path: '', redirectTo: '/initial', pathMatch: 'full' },
  { path: 'initial', component: InitialComponent },
  { path: 'city/:id/:name', component: CityComponent },
  { path: 'graph', component: GraphsComponent },
  { path: 'user', component: NewUserComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'graphs/:id/:name', component: GraphsComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  exports: [RouterModule]
})
/**This is the routing module. It is responsible for the navigation across the different components, redirecting the application to the right one for each URL.*/
export class AppRoutingModule { }