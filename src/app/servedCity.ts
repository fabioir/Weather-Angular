/** These are classes to give a type to the server DB results and avoid errors */
export class ServedCity {
    NAME: string;
    ID: number;
    COUNTRY: string;
    LON: number;
    LAT: number;


    constructor(name: string, id: number, country: string = '', lon: number = 0, lat: number = 0) {
        this.NAME = name;
        this.ID = id;
        this.COUNTRY = country;
        this.LON = lon;
        this.LAT = lat;

    }
}

export class ServerResponse {
    data: Array<ServedCity>;
}