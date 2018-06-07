export class SavedCity{
    name: string;
    id: string;
    sys : {country : string};
    coord : {
        lon : number,
        lat: number
    };

    constructor(name: string, id: string, country: string = '', lon: number = 0, lat: number = 0) {
        this.name = name;
        this.id = id;
        this.sys = {
            country : country
        };

        this.coord = {
            lon: lon,
            lat: lat
        };
    }
}
//This object is for displaying and linking to the searched cities. It is used too for storing favourite cities.