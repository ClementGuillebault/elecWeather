const {app, BrowserWindow, ipcMain, Tray} = require('electron')
const path = require('path')

let tray   = null;
let window = null;
let assets = './assets';
let img    = './assets/img';


app.on('ready', () => {
  createTray();
  createWindow();
})

app.on('window-all-closed', () => {
  app.quit();
})

/**
 * @function createTray
 * Tray creation
 */
function createTray() {
    tray = new Tray(path.join(img, 'icon.ico'))

    tray.on('right-click', toggleWindow);
    tray.on('double-click', toggleWindow);

    tray.on('click', () => {
        toggleWindow();
    })
}

/**
 * @function getWindowPosition
 * Get window position from tray position
 */
function getWindowPosition() {
    let windowBounds = window.getBounds();
    let trayBounds   = tray.getBounds();

    let x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))

    let y = Math.round(trayBounds.y + trayBounds.height - 454)

    return {x: x, y: y}
}

/**
 * @function createWindow
 * Create window
 */
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

    window.on('blur', () => {
        window.hide();
    })
}

/**
 * @function toggleWindow
 * Hide or not window
 */
function toggleWindow() {
    if (window.isVisible()) {
        window.hide();
    }
    else {
        showWindow();
    }
}

/**
 * @function showWindow
 * Show window
 */
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
    tray.setToolTip('Temperature: ' + weather._weatherNormalized.temperature + '°');
    tray.setImage(path.join(img, weather._weatherNormalized.img));
})