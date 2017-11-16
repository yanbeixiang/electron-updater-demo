const { autoUpdater } = require('electron-updater');
const log = require('./logger');
const { ipcMain, BrowserWindow, Menu } = require('electron');
const { version } = require('../../package.json');
const { isDev, indexPage } = require('./config.default');

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;

class AutoUpdaterController {
    constructor() {
        this.updaterWin = null;
        this.state = {};

        autoUpdater.on('update-available', this.handleUpdateAvailable.bind(this));
        autoUpdater.on('update-not-available', this.handleUpdateNotAvailable.bind(this));
        autoUpdater.on('checking-for-update', this.handleCheckingForUpdate.bind(this));
        autoUpdater.on('download-progress', this.handleDownloadProgress.bind(this));
        autoUpdater.on('update-downloaded', this.handleUpdateDownloaded.bind(this));
        autoUpdater.on('error', this.handleError.bind(this));

        ipcMain.on('update-state-request', (e) => e.sender.send('update-state-change', this.state));
        ipcMain.on('update-download', this.downloadUpdate.bind(this));
        ipcMain.on('update-quit-and-install', autoUpdater.quitAndInstall || _.noop);
    }

    setMainWindow(mainWindow) {
        this.mainWindow = mainWindow;
    }

    downloadUpdate () {
        this.updaterWin.setSize(500, 200);
        this.setState({
            downloadProgress: {
                percent: 0,
            },
        });
        autoUpdater.downloadUpdate && autoUpdater.downloadUpdate();
    }

    handleUpdateAvailable(updateInfo) {
        log.info('Found update', updateInfo);

        // If window not open, open it to notify user
        this.openUpdaterWindow(this.mainWindow);
        this.forceFocus();
        this.setState({
            hasUpdateAvailable: true,
            updateInfo
        });
    }

    handleUpdateNotAvailable () {
        log.info('No update available');
        this.setState({
            hasNoUpdateAvailable: true,
        });
    }

    handleCheckingForUpdate () {
        log.info('Looking for updates');
        this.setState({
            checkingForUpdate: true,
        });
    }

    handleDownloadProgress (downloadProgress) {
        log.info('Downloading...', downloadProgress);
        this.setState({
            downloadProgress
        });
    }

    handleUpdateDownloaded (updateInfo) {
        log.info('Download complete', updateInfo);
        // Focus on window when the download is done to get the user's attention
        this.forceFocus();
        this.setState({
            updateDownloaded: true,
            updateInfo,
        });
    }

    handleError (error) {
        log.info('Updater error occurred', error);
        this.updaterWin.setSize(500, 200);
        this.setState({
            error,
        });
    }

    forceFocus () {
        if (this.updaterWin) {
            this.updaterWin.focus();
        }
    }

    async checkForUpdates () {
        const isWin = process.platform === 'win32';
        const isMac = process.platform === 'darwin';

        // Only check for updates on Mac and Windows (auto update not supported in linux)
        if (isMac || isWin) {
            log.info('Checking for updates');

            // squirrel.windows needs time to initialize the first time it's run (https://github.com/electron/electron/issues/4306)
            // if it's a first run, give it a long time (20 seconds) to let squirrel.windows initialize before checking for updates
            // if (isWin && !await settings.get(SQUIRREL_FIRST_RUN)) {
            //     await B.delay(20000);
            //     await settings.set(SQUIRREL_FIRST_RUN, true);
            // }
            this.setState({
                isCheckingForUpdates: true,
            });
            autoUpdater.checkForUpdates();
        } else {
            this.setState({
                unsupported: true,
            });
        }
    }

    //更新autoUpdater的状态，并将该状态发送到updater窗口
    setState (newState) {
        this.state = newState;
        if (this.updaterWin) {
            this.updaterWin.send('update-state-change', this.state);
        }
    }

    //打开一个浏览器窗口，在UI中显示更新的状态
    openUpdaterWindow (mainWindow) {
        // If we already opened the window, don't do anything
        let updaterWin = this.updaterWin;
        if (updaterWin) {
            return;
        }

        // Create and open the Browser Window
        this.updaterWin = updaterWin = new BrowserWindow({
            width: 600,
            height: 400,
            title: "Update Available",
            backgroundColor: "#f2f2f2",
            webPreferences: {
                devTools: true
            },
            // resizable: false,
        });

        updaterWin.loadURL(`${indexPage}#/updater`);
        updaterWin.show();

        // When the main window is closed, close the session window too
        updaterWin.once('closed', () => {
            this.updaterWin = null;
        });

        // If it's dev, go ahead and open up the dev tools automatically
        if (isDev) {
            updaterWin.openDevTools();
        }
        updaterWin.webContents.on('context-menu', (e, props) => {
            const {x, y} = props;

            Menu.buildFromTemplate([{
                label: 'Inspect element',
                click () {
                    updaterWin.inspectElement(x, y);
                }
            }]).popup(updaterWin);
        });

        // If the main window closes, close the updater window too
        mainWindow.on('closed', updaterWin.close);

        mainWindow.openDevTools();
    }
}

let autoUpdaterInstance = new AutoUpdaterController();
module.exports = autoUpdaterInstance;