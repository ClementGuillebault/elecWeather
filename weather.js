class Weather {
    constructor(weather) {
        this._weather = weather;
        this._weatherNormalized = {};
        this.normalize();
    }

    get weather() {
        return this._weather;
    }

    get weatherNormalized() {
        return this._weatherNormalized;
    }

    normalize() {
        this.temperature();
        this.condition();
        this.wind();
        this.humidity();
        this.precipitation();
        this.cloudCoverage();
        this.visibility();
    }

    temperature() {
        this._weatherNormalized.temperature = Math.round(this._weather.main.temp - 273.15);
    }

    visibility() {
        this._weatherNormalized.visibilite = this._weather.visibility;
    }

    wind() {
        this._weatherNormalized.vent = Math.round(this._weather.wind.speed * 3.6);
        this._weatherNormalized.dirVent = this.getWindDirection(this._weather.wind.deg);
    }

    getWindDirection(direction) {
        if (direction < 45) return 'NNE';
        if (direction === 45) return 'NE';

        if (direction < 90) return 'ENE';
        if (direction === 90) return 'E';

        if (direction < 135) return 'ESE';
        if (direction === 135) return 'SE';

        if (direction < 180) return 'SSE';
        if (direction === 180) return 'S';

        if (direction < 225) return 'SSW';
        if (direction === 225) return 'SW';

        if (direction < 270) return 'WSW';
        if (direction === 270) return 'W';

        if (direction < 315) return 'WNW';
        if (direction === 315) return 'NW';

        if (direction < 360) return 'NNW';
        return 'N';
    }

    humidity() {
        this._weatherNormalized.humidite = this._weather.main.humidity;
    }

    precipitation() {
        this._weatherNormalized.precipitation = this._weather.precipitation ? this._weather.precipitation : '0';
    }

    cloudCoverage() {
        if (this._weather.clouds.all < 30) {
            this._weatherNormalized.couverturenuageuse = 'Dégagé';
        }
        else if (this._weather.clouds.all > 30 && this._weather.clouds.all < 70) {
            this._weatherNormalized.couverturenuageuse = 'Partiellement dégagé';
        }
        else {
            this._weatherNormalized.couverturenuageuse = 'Couvert';
        }
    }

    condition() {
        switch(this._weather.weather[0].main) {
            case 'Thunderstorm':
                this._weatherNormalized.condition = 'Orageux';
                this._weatherNormalized.img = 'thunderstorm.png';
                break;
            case 'Drizzle':
            case 'Rain':
                this._weatherNormalized.condition = 'Pluvieux';
                this._weatherNormalized.img = 'rain.png';
                break;
            case 'Snow':
                this._weatherNormalized.condition = 'Neigeux';
                this._weatherNormalized.img = 'snow.png';
                break;
            case 'Mist':
                this._weatherNormalized.condition = 'Brouillard';
                this._weatherNormalized.img = 'mist.png';
                break;
            case 'Clouds':
                this._weatherNormalized.condition = 'Nuageux';
                this._weatherNormalized.img = 'cloud.png';
                break;
            case 'Clear':
                this._weatherNormalized.condition = 'Ensoleillé';
                this._weatherNormalized.img = 'clear.png';
                break
            default:
                this._weatherNormalized.condition = 'Aucune information';
                this._weatherNormalized.img = 'default.png';
                break;
        }
    }
}

module.exports = Weather;