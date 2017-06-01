const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')


let tray = null;
let window = null;
let assets = './assets';
let img = './assets/img';

app.on('ready', () => {
  createTray();
  createWindow();
})

app.on('window-all-closed', () => {
  app.quit()
})

function createTray() {
    tray = new Tray(path.join(img, 'icon.ico'))
    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);
    tray.on('click', () => {
        toggleWindow();
    })
}

function getWindowPosition() {
    let windowBounds = window.getBounds();
    let trayBounds = tray.getBounds();

    // Center window horizontally below the tray icon
    let x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    // Position window 4 pixels vertically below the tray icon
    let y = Math.round(trayBounds.y + trayBounds.height - 454)

    return {x: x, y: y}
}

function createWindow() {
    window = new BrowserWindow({
        width: 280,
        height: 450,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            backgroundThrottling: false
        }
    })
    window.loadURL('file://' + path.join(__dirname, 'views/index.html'));

    // Hide the window when it loses focus
    window.on('blur', () => {
        window.hide();
    })
}

function toggleWindow() {
    if (window.isVisible()) {
        window.hide();
    }
    else {
        showWindow();
    }
}

function showWindow() {
    let position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
    window.focus();
}

ipcMain.on('show-window', () => {
    showWindow();
})

ipcMain.on('weather-upd', (event, weather) => {
    console.log(weather);
    let temp = Math.round(weather.main.temp -273.15);
    tray.setToolTip('Temperature: ' + temp + '°');

    switch (weather.weather[0].main) {
        case 'Thunderstorm':
        case 'Drizzle':
        case 'Rain':
            //tray.setImage(path.join(img, 'cloudTemplate.png'))
            break
        case 'Snow':
            //tray.setImage(path.join(img, 'umbrellaTemplate.png'))
            break
        case 'Mist':
        case 'Clouds':
            tray.setImage(path.join(img, 'cloud.png'))
            break
        case 'Clear':
            tray.setImage(path.join(img, 'clear.png'))
            break
        default:
            tray.setImage(path.join(img, 'icon.ico'))
    }
})