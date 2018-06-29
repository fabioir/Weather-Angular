import { SavedCity } from "./savedCity";
/**This is a class to manage User's information */
export class UserServer {
    username: string;
    password: string;
    favouriteCities: string;
    citiesId: Array<string>;
    citiesList: Array<SavedCity>;

    constructor() { }

    /**Returns a string displaying the user information */
    display(): string {
        return "Username: " + this.username + "\nPassword: " + this.password + "\nCities ids: " + this.citiesId;
    }
    /**Fills from a unique string (as stored in DB) an Array of strings containing IDs */
    setFromList(list: Array<SavedCity>) {
        this.favouriteCities = list.map(item => item.id).join(',');
    }
}

export class CitiesResponse {
    data: Array<CitiesResponseUnit>;
}

export class CitiesResponseUnit {
    CITIES: string;
}