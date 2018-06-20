import { SavedCity } from "./savedCity";

export class UserServer {
    username : string;
    password : string;
    favouriteCities : string;
    citiesId : Array<string>;
    citiesList : Array<SavedCity>;
    expirationTime : number;

    constructor(aux?: AuxServerData){
        if(aux === undefined){
            return;
        }
        this.username = aux.data[0].USERNAME;
        this.password = aux.data[0].PASSWORD;
        this.citiesId = aux.data[0].CITIES.split(',');
        this.expirationTime = parseInt(aux.data[0].EXPIRES);
    }

    display(): string{
        return "Username: " + this.username + "\nPassword: " + this.password + "\nCities ids: " + this.citiesId + "\nSession expiration time: " + this.expirationTime;
    }

    setFromList(list : Array<SavedCity>){
        this.favouriteCities = list.map(item => item.id).join(',');
    }
}

export class UserServerRaw {
    USERNAME : string;
    PASSWORD : string;
    CITIES : string;
    EXPIRES : string;
}

export class AuxServerData {
    data : Array<UserServerRaw>;
}