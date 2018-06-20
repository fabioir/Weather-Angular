export class SavedCity{
    name: string;
    id: string;
    sys : {country : string};
    country: string;
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

    insertBody(): string{
        //Prepares a string to make an insert to the server
        return `{
            "data": {
              "ID": ` + this.id + `,
              "COUNTRY": "` + this.sys.country + `",
              "LAT": ` + this.coord.lat + `,
              "LON": ` + this.coord.lon + `,
              "NAME": "` + this.name + `"	
            }
            
           }`;
    }
}
//This object is for displaying and linking to the searched cities. It is used too for storing favourite cities.