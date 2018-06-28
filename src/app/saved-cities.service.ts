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
    /**Returns an Observable that emits new values of the Saved cities List */
    return <Observable<SavedCity[]>> this.updated.asObservable();
  }

  getSavedCities(): SavedCity[] {
    /**Gets the cities list from the localStorage and launches an Observable through updated*/
    this.cities = [];
    if(JSON.parse(localStorage.getItem("favouriteCities")) === null){ //if there are no cities in the local storage
      this.updated.next(this.cities); //return cities = [] from the Observable
      return [];
    }
    JSON.parse(localStorage.getItem("favouriteCities")).forEach(element => { //Get back from LS
      this.city = new SavedCity(element.name, element.id, element.country, element.coord.lon, element.coord.lat);
      this.cities.push(this.city);
      this.updated.next(this.cities); //Return Array<SavedCity> from the Observable
      return this.cities;
    });
    
   return this.cities; //Never reaches this instruction? Yes, surpridingly it does, and everything crashed when I commented it
  }

  save(cityToSave : SavedCity){
    /**Includes a non existing city in the list and updates the localStorage cities list */
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
    /**Removes cities list data from local Storage and updates the component's city list emmiting a Observable with the list empty */
    localStorage.removeItem("favouriteCities");
    this.getSavedCities(); //Send an updated observable with the cities available
  }
 
}
 /* 
 This service manages the list of cities saved in the local storage.
 Returns an Observable with changes in the cities list an can modify or delete the list
  */