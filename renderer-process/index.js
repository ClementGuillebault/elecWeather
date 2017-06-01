const {ipcRenderer, shell} = require('electron')
const Weather = require('../weather');

/**
 * @function getWeather
 * @param {string} town
 * Get data from API weather URL 
 */
function getWeather(town='Caen') {
    const key = '88bb49385d50153ff1e400ccedf38cda';
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + town + '&APPID=' + key;

    return window.fetch(url).then((response) => {
        return response.json();
    });
}

/**
 * @function updateView
 * @param {object} weather
 * Update view with data 
 */
function updateView(weather) {
    document.getElementById('temp').innerHTML          = weather._weatherNormalized.temperature + '°';
    document.getElementById('condition').innerHTML     = weather._weatherNormalized.condition;
    document.getElementById('wind').innerHTML          = weather._weatherNormalized.vent + ' km/h';
    document.getElementById('winddir').innerHTML       = weather._weatherNormalized.dirVent;
    document.getElementById('humidity').innerHTML      = weather._weatherNormalized.humidite + '%';
    document.getElementById('precipitation').innerHTML = weather._weatherNormalized.precipitation + ' mm';
    document.getElementById('visibility').innerHTML    = weather._weatherNormalized.visibilite + ' m';
    document.getElementById('cloudcoverage').innerHTML = weather._weatherNormalized.couverturenuageuse;
}

/**
 * @function sendNotification
 * @param {object} weather 
 * Send notification on desktop
 */
function sendNotification(weather) {
    let notification = new Notification('Conditions climatiques', {
        body: 'Température extérieur ' + weather._weatherNormalized.temperature + '°',
        icon: '../assets/img/' + weather._weatherNormalized.img
    });

    notification.addEventListener('click', () => {
        ipcRenderer.send('show-window');
    });
}

/**
 * @function updateWeather
 * MaJ weather
 */
function updateWeather() {
    getWeather().then((res) => {
        let weather = new Weather(res);
        ipcRenderer.send('weather-upd', weather);
        updateView(weather);
        sendNotification(weather);
    })
}

//30 minutes
let time = 30 * 60 * 1000
setInterval(updateWeather, time)

//Bind function when dom is loaded
document.addEventListener('DOMContentLoaded', updateWeather)