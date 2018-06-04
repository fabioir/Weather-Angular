import { Weather } from './weather';
import { Data } from './city/data'

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

    //Variables para el displayValues()

    result = new Array<Data>();
    aux : Data; 

    constructor() {
        this.weather = new Array<Weather>();
     }

    set(rx? : WeatherNow){
        
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

    displayValues(): Array<Data> {

        this.result = [];

        //coord
        this.checkAndSave('longitude', this.coord.lon,'');
        this.checkAndSave('latitude', this.coord.lat,'');

      
        //weather
        let i = 0;
        this.weather.forEach(w =>{
            i++;
            this.checkAndSave('id', w.id,'(' + i + ')');
            this.checkAndSave('main', w.main,'(' + i + ')');
            this.checkAndSave('description', w.description,'(' + i + ')');
            this.checkAndSave('icon', w.icon,'(' + i + ')');
            
        });

        //base
        this.checkAndSave('base', this.base,'');
        
        //main
        this.checkAndSave('temperature', this.main.temp,'');
        this.checkAndSave('pressure', this.main.pressure,'');
        this.checkAndSave('humidity', this.main.humidity,'');
        this.checkAndSave('minimum temperature', this.main.temp_min,'');
        this.checkAndSave('maximum temperature', this.main.temp_max,'');
        this.checkAndSave('pressure at sea level', this.main.sea_level,'');
        this.checkAndSave('pressure at ground level', this.main.grnd_level,'');
        

        //wind
        this.checkAndSave('Wind speed', this.wind.speed,'');
        this.checkAndSave('Wind direction', this.wind.deg,'');
        
        //clouds
        this.checkAndSave('Clouds percentage', this.clouds.all,'%');
        
        //rain
        this.checkAndSave('Rain volume in the last 3 hours', this.rain,' litres');
        
        //snow
        this.checkAndSave('Snow volume in the last 3 hours', this.snow,' litres');
       
        //dt
        this.checkAndSave('dt', this.dt,'');

        //sys
        this.checkAndSave('sys type', this.sys.type,'');
        this.checkAndSave('sys id', this.sys.id,'');
        this.checkAndSave('sys message', this.sys.message,'');
        this.checkAndSave('sys country', this.sys.country,'');
        this.checkAndSave('sys sunrise', this.sys.sunrise,'');
        this.checkAndSave('sys sunset', this.sys.sunset,'');
        
        //id
        this.checkAndSave('id', this.id,'');

        //name
        this.checkAndSave('name', this.name,'');

        //cod
        this.checkAndSave('cod', this.cod,'');
        
        
        return this.result;
    }

    checkAndSave(text: string, variable: any, additional: string = ''){
        
        if(!( variable === undefined || variable === null)){
            
            this.aux = {
                parameter: text,
                value: variable + additional
            };

            this.result.push(this.aux);
        }

    }
}

//This Object stores the information received from the API and prepares it to being displayed.