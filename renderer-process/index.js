const {ipcRenderer, shell} = require('electron')
const Weather = require('../weather');

function getWeather(town='') {
    const key = '';
    const url = 'http://api.openweathermap.org/data/2.5/weather?q=' + town + '&APPID=' + key;

    return window.fetch(url).then((response) => {
        return response.json();
    });
}

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


function sendNotification(weather) {
    let notification = new Notification('Conditions climatiques', {
        body: 'Température extérieur ' + weather._weatherNormalized.temperature + '°',
        icon: '../assets/img/' + weather._weatherNormalized.img
    });

    notification.addEventListener('click', () => {
        ipcRenderer.send('show-window');
    });
}

function updateWeather() {
    getWeather().then((res) => {
        let weather = new Weather(res);
        ipcRenderer.send('weather-upd', weather);
        updateView(weather);
        sendNotification(weather);
    })
}

let time = 30 * 60 * 1000
setInterval(updateWeather, time)

document.addEventListener('DOMContentLoaded', updateWeather)