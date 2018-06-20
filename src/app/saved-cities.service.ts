import { Injectable } from '@angular/core';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs'



@Injectable({
  providedIn: 'root'
})
export class SavedCitiesService {

  cities : SavedCity[];
  city : SavedCity;
  updated = new Subject();


  constructor() { }

  getUpdates(): Observable<SavedCity[]>{
    return <Observable<SavedCity[]>> this.updated.asObservable();
  }

  getSavedCities(): SavedCity[] {
    this.cities = [];
    if(JSON.parse(localStorage.getItem("favouriteCities")) === null){ //if there are no cities in the local storage
      this.updated.next(this.cities); //return cities = [] from the Observable
      return [];
    }
    JSON.parse(localStorage.getItem("favouriteCities")).forEach(element => { //Get back from LS
      this.city = new SavedCity(element.name, element.id);
      this.cities.push(this.city);
      this.updated.next(this.cities); //Return Array<SavedCity> from the Observable
      return this.cities;
    });
    
   return this.cities; //Never reaches this instruction? Yes, surpridingly it does, and everything crashed when I commented it
  }

  save(cityToSave : SavedCity){
    if(
      this.cities.find(city => city.id === cityToSave.id) == undefined
    ){
    this.cities.push(cityToSave);
    localStorage.setItem("favouriteCities",JSON.stringify(this.cities));
    this.updated.next(this.cities); //Metemos cities en el Subject
  }else{
    //console.log('This city has already been saved');
  }

  }

  deleteCities(){
    localStorage.removeItem("favouriteCities");
    this.getSavedCities(); //Send an updated observable with the cities available
  }
 
}
 /* 
 This service manages the list of cities saved in the local storage.
 Returns an Observable with changes in the cities list an can modify or delete the list
  */