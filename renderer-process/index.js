const {ipcRenderer, shell} = require('electron')

function getWeather(town='') {
    // FIXME replace with your own API key
    // Register for one at https://developer.forecast.io/register
    const key = '';
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + town + '&APPID=' + key;

    return window.fetch(url).then((response) => {
        return response.json()
    })
}

function updateView(weather) {
    let temp = Math.round(weather.main.temp -273.15);
    let vent = Math.round(weather.wind.speed * 3.6);
    document.getElementById('temp').innerHTML = temp + '°';
    document.getElementById('condition').innerHTML = weather.weather[0].main;
    document.getElementById('wind').innerHTML = vent + ' km/h';
    document.getElementById('winddir').innerHTML = getWindDirection(weather.wind.deg);
    document.getElementById('humidity').innerHTML = weather.main.humidity + '%';
    document.getElementById('precipitation').innerHTML = weather.precipitation;
    document.getElementById('visibility').innerHTML = weather.visibility + 'm';
    document.getElementById('cloudcoverage').innerHTML = getCloudCoverage(weather.clouds.all);
}

function getCloudCoverage(cloudCoverage) {
    if (cloudCoverage<30) {
        return 'Dégagé';
    }
    if (cloudCoverage>30 && cloudCoverage<70) {
        return 'Partiellement dégagé';
    }
    return 'Couvert';
}

function getWindDirection(direction) {
  if (direction < 45) return 'NNE'
  if (direction === 45) return 'NE'

  if (direction < 90) return 'ENE'
  if (direction === 90) return 'E'

  if (direction < 135) return 'ESE'
  if (direction === 135) return 'SE'

  if (direction < 180) return 'SSE'
  if (direction === 180) return 'S'

  if (direction < 225) return 'SSW'
  if (direction === 225) return 'SW'

  if (direction < 270) return 'WSW'
  if (direction === 270) return 'W'

  if (direction < 315) return 'WNW'
  if (direction === 315) return 'NW'

  if (direction < 360) return 'NNW'
  return 'N'
}

function updateWeather() {
    getWeather().then((weather) => {
        ipcRenderer.send('weather-upd', weather)
        updateView(weather)
    })
}

// Refresh weather every 10 minutes
const tenMinutes = 10 * 60 * 1000
setInterval(updateWeather, tenMinutes)

// Update initial weather when loaded
document.addEventListener('DOMContentLoaded', updateWeather)