import { Injectable } from '@angular/core';
import { SavedCity } from './savedCity';
import { Observable, Subject } from 'rxjs'



@Injectable({
  providedIn: 'root'
})
export class SavedCitiesService {

  cities : SavedCity[];
  city : SavedCity;
  /*private updated = new Observable((observer) =>{
    observer.next(this.getSavedCities());
  });*/
  updated = new Subject();


  constructor() { }

  getUpdates(): Observable<SavedCity[]>{
    return <Observable<SavedCity[]>> this.updated.asObservable();
  }

  getSavedCities(): SavedCity[] {
    this.cities = [];
    if(JSON.parse(localStorage.getItem("favouriteCities")) === null){
      return [];
    }
    JSON.parse(localStorage.getItem("favouriteCities")).forEach(element => {
      this.city = new SavedCity(element.name, element.id);
      this.cities.push(this.city);
      this.updated.next(this.cities); //Metemos cities en el Subject
      return this.cities;
    });
    console.log("getSavedCities()");
    
    return this.cities;
  }

  save(cityToSave : SavedCity){
    if(
      this.cities.find(city => city.id === cityToSave.id) == undefined
    ){
    this.cities.push(cityToSave);
    localStorage.setItem("favouriteCities",JSON.stringify(this.cities));
    console.log("save()");
    this.updated.next(this.cities); //Metemos cities en el Subject
  }else{
    console.log('This city has already been saved');
  }

  }
}
