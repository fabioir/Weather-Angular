import { Weather } from './weather';

export class WeatherNow {

    coord: {lon: number, lat: number};
    weather: Array<Weather>;

    /* id: number;
    main: string;
    description: string;
    icon: string;*/

    base: string;
    main: {temp: number, pressure: number, humidity: number, temp_min: number, temp_max: number, sea_level: number, grnd_level: number};
    wind: {speed: number, deg: number};
    clouds: {all: number};
    rain: number;
    snow: number;
    dt: number;
    sys: {type: number, id: number, message: number, country: string, sunrise: number, sunset: number };
    id: number;
    name: string;
    cod: number;

    constructor() {
        this.weather = new Array<Weather>();
     }

    set(rx? : WeatherNow){
        /*if( rx == null || rx == undefined) {
            console.log("RX is null or undefined");
            return;
        }
        rx = <WeatherNow>rx;

        console.log(this.coord.lon + " This is " rx.coord.lon);*/

        this.coord = {
            lon: rx.coord.lon,
            lat: rx.coord.lat
        };
        
        rx.weather.forEach((w: Weather) => {
            
            let wthr = new Weather();
            wthr = {
                id: w.id,
                main: w.main,
                description: w.description,
                icon: w.icon
            };

            this.weather.push(wthr);
        });
        
        this.base = rx.base;
        
        this.main = {
            temp: rx.main.temp,
            pressure: rx.main.pressure,
            humidity: rx.main.humidity,
            temp_min: rx.main.temp_min,
            temp_max: rx.main.temp_max,
            sea_level: rx.main.sea_level,
            grnd_level: rx.main.grnd_level
        };
        
        this.wind = {
            speed: rx.wind.speed,
            deg: rx.wind.deg
        };
        

        this.clouds = {
            all: rx.clouds.all
        };

        this.rain = rx.rain;

        this.snow = rx.snow;

        this.dt = rx.dt;
        
        this.sys = {
            type: rx.sys.type,
            id: rx.sys.id,
            message: rx.sys.message,
            country: rx.sys.country,
            sunrise: rx.sys.sunrise,
            sunset: rx.sys.sunset
        };
        
        this.id = rx.id;

        this.name = rx.name;

        this.cod = rx.cod;
    }

    displayValues() {
        return this.weather[0].description;
    }
}