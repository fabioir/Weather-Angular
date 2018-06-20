import { Weather } from '../weather'


export class Data {
    parameter: string;
    value: string;

    constructor() { }
}
/* Data is used to transfer information as an array of Data to the MatTable in city */

export class Forecast {

    clouds: { all: number };
    dt: number;
    dt_txt: string;

    main: {
        grnd_level: number,
        humidity: number,
        pressure: number,
        sea_level: number,
        temp: number,
        temp_kf: number,
        temp_max: number,
        temp_min: number
    };

    weather: Array<Weather>;
    /*
        id
        main
        description
        icon
    */

    wind: {
        speed: number,
        deg: number
    }

    rain: number;
    snow: number;
    constructor(element: Forecast) {
        this.weather = new Array<Weather>();

        this.clouds = element.clouds;
        this.dt = element.dt;
        this.dt_txt = element.dt_txt;

        this.main = {
            grnd_level: element.main.grnd_level,
            humidity: element.main.humidity,
            pressure: element.main.pressure,
            sea_level: element.main.sea_level,
            temp: element.main.temp,
            temp_kf: element.main.temp_kf,
            temp_max: element.main.temp_max,
            temp_min: element.main.temp_min
        };


        element.weather.forEach((weather: Weather) => {
            const w = new Weather();
            w.main = weather.main;
            w.id = weather.id;
            w.icon = weather.icon;
            w.description = weather.description;

            this.weather.push(w);
        });

        this.wind = {
            speed: element.wind.speed,
            deg: element.wind.deg
        };

        if (element.rain == undefined) {
            //console.log("rain undefined");
        } else {
            this.rain = element.rain["3h"];
        }

        if (element.snow == undefined) {
            //console.log("snow undefined");
        } else {
            this.snow = element.snow["3h"];
        }

    }
}
/* The object Forecast stores all the information about the weather provided by the service for a certain hour */

export class RespuestaForecast {

    list: Array<Forecast>;

    constructor() { }
}

/* 
Data types used for sending data to the mat-table, Graph services and managing a server response containing the forecast for several hours.
*/