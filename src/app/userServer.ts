import { SavedCity } from "./savedCity";

export class UserServer {
    username : string;
    password : string;
    favouriteCities : string;
    citiesId : Array<string>;
    citiesList : Array<SavedCity>;

    constructor(){}
    

    display(): string{
        return "Username: " + this.username + "\nPassword: " + this.password + "\nCities ids: " + this.citiesId;
    }

    setFromList(list : Array<SavedCity>){
        this.favouriteCities = list.map(item => item.id).join(',');
    }
}




//New
export class CitiesResponse {
    data : Array<CitiesResponseUnit>;
}

export class CitiesResponseUnit {
    CITIES : string;
}