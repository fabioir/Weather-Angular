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

    displayValues(): Array<Data> {

        this.result = [];
        //checkAndSave(text: string, variable: any, additional: string = '')

        //coord
        this.checkAndSave('longitude', this.coord.lon,'');
        this.checkAndSave('latitude', this.coord.lat,'');

       /* if(!( this.coord.lon === undefined || this.coord.lon === null)){
            this.aux.push('longitude');
            this.aux.push(this.coord.lon.toString());

            this.result.push(this.aux);
            this.aux = [];
        }
        if(!( this.coord.lat === undefined || this.coord.lat === null)){
            this.aux.push('latitude');
            this.aux.push(this.coord.lat.toString());

            this.result.push(this.aux);
            this.aux = [];
        }*/

        //weather
        let i = 0;
        this.weather.forEach(w =>{
            i++;
            this.checkAndSave('id', w.id,'(' + i + ')');
            this.checkAndSave('main', w.main,'(' + i + ')');
            this.checkAndSave('description', w.description,'(' + i + ')');
            this.checkAndSave('icon', w.icon,'(' + i + ')');
            /*if(!( w.id === undefined || w.id === null)){
                this.aux.push('id');
                this.aux.push(w.id.toString());
    
                this.result.push(w);
                this.aux = [];
            }

            if(!( w.main === undefined || w.main === null)){
                this.aux.push('main');
                this.aux.push(w.main.toString());
    
                this.result.push(this.aux);
                this.aux = [];
            }

            if(!( w.description === undefined || w.description === null)){
                this.aux.push('description');
                this.aux.push(w.description.toString());
    
                this.result.push(this.aux);
                this.aux = [];
            }

            if(!( w.icon === undefined || w.icon === null)){
                this.aux.push('icon');
                this.aux.push(w.icon.toString());
    
                this.result.push(this.aux);
                this.aux = [];
            }*/
            
        });

        //base
        this.checkAndSave('base', this.base,'');
        /*if(!( this.base === undefined || this.base === null)){
                this.aux.push('base');
                this.aux.push(this.base);
    
                this.result.push(this.aux);
                this.aux = [];
        }*/

       

        //main
        this.checkAndSave('temperature', this.main.temp,'');
        this.checkAndSave('pressure', this.main.pressure,'');
        this.checkAndSave('humidity', this.main.humidity,'');
        this.checkAndSave('minimum temperature', this.main.temp_min,'');
        this.checkAndSave('maximum temperature', this.main.temp_max,'');
        this.checkAndSave('pressure at sea level', this.main.sea_level,'');
        this.checkAndSave('pressure at ground level', this.main.grnd_level,'');
        /*if(!( this.main.temp === undefined || this.main.temp === null)){
            this.aux.push('temperature');
            this.aux.push(this.main.temp.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.pressure === undefined || this.main.pressure === null)){
            this.aux.push('pressure');
            this.aux.push(this.main.pressure.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.humidity === undefined || this.main.humidity === null)){
            this.aux.push('humidity');
            this.aux.push(this.main.humidity.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.temp_min === undefined || this.main.temp_min === null)){
            this.aux.push('minimun temperature');
            this.aux.push(this.main.temp_min.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.temp_max === undefined || this.main.temp_max === null)){
            this.aux.push('maximum temperature');
            this.aux.push(this.main.temp_max.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.sea_level === undefined || this.main.sea_level === null)){
            this.aux.push('pressure at sea level');
            this.aux.push(this.main.sea_level.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.main.grnd_level === undefined || this.main.grnd_level === null)){
            this.aux.push('pressure at ground level');
            this.aux.push(this.main.grnd_level.toString());

            this.result.push(this.aux);
            this.aux = [];
        }*/

        //wind
        this.checkAndSave('Wind speed', this.wind.speed,'');
        this.checkAndSave('Wind direction', this.wind.deg,'');
        /*if(!( this.wind.speed === undefined || this.wind.speed === null)){
            this.aux.push('Wind speed');
            this.aux.push(this.wind.speed.toString());

            this.result.push(this.aux);
            this.aux = [];
        }

        if(!( this.wind.deg === undefined || this.wind.deg === null)){
            this.aux.push('Wind direction');
            this.aux.push(this.wind.deg.toString());

            this.result.push(this.aux);
            this.aux = [];
        }*/

        //clouds
        this.checkAndSave('Clouds percentage', this.clouds.all,'%');
        /*
        if(!( this.clouds.all === undefined || this.clouds.all === null)){
            this.aux.push('Clouds percentage');
            this.aux.push(this.clouds.all.toString() + '%');

            this.result.push(this.aux);
            this.aux = [];
        }*/

        //rain
        this.checkAndSave('Rain volume in the last 3 hours', this.rain,' litres');
        /*if(!( this.rain === undefined || this.rain === null)){
            this.aux.push('Rain volume in the last 3 hours');
            this.aux.push(this.rain.toString() + ' litres');

            this.result.push(this.aux);
            this.aux = [];
        }*/

        //snow
        this.checkAndSave('Snow volume in the last 3 hours', this.snow,' litres');
        /*if(!( this.snow === undefined || this.snow === null)){
            this.aux.push('Snow volume in the last 3 hours');
            this.aux.push(this.snow.toString() + ' litres');

            this.result.push(this.aux);
            this.aux = [];
        }*/

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


            /*this.aux.push(text);
            this.aux.push(variable.toString() + additional);*/

            this.result.push(this.aux);
            //this.aux = [];
        }

    }
}