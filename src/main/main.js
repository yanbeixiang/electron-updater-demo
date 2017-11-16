const { app, BrowserWindow, Menu } = require('electron');
const { isDev, indexPage } = require('./config.default');
const { getMenuTemplate } = require('./menu');

let mainWindow = null;
const winDefaultOptions = {
    minWidth: 800,
    minHeight: 600,
    width: 1280,
    height: 960,
    backgroundColor: "#f2f2f2",
};

function initialize() {
    app.on('ready', () => {
        createMainWindow();

        let template = getMenuTemplate(mainWindow);
        let menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

    });

    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });
}

function createMainWindow() {
    mainWindow = new BrowserWindow(winDefaultOptions);

    mainWindow.loadURL(indexPage);

    mainWindow.show();

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    if (isDev) {
        mainWindow.openDevTools();
    }
}

initialize();