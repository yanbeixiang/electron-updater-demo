const { Menu } = require("electron");
const autoUpdater = require('./autoUpdate');

function getMenuTemplate(mainWindow) {
    return [
        {
            label: "Application",
            submenu: [
                {
                    label: "Check for updates",
                    click() {
                        autoUpdater.openUpdaterWindow(mainWindow);
                        autoUpdater.checkForUpdates();
                    }
                }
            ]
        }
    ];
}

exports.getMenuTemplate = getMenuTemplate;