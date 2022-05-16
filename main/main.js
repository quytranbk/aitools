const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron');
const robotjs = require('robotjs');
const nutjs = require('@nut-tree/nut-js');
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1920, 
        height: 600, 
        y: 0,
        x: 0,
        webPreferences: 
        { 
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
            spellcheck: false
        }
    });

    // and load the index.html of the app.
    const startUrl = process.env.ELECTRON_START_URL || url.format({
            pathname: path.join(__dirname, '/../build/index.html'),
            protocol: 'file:',
            slashes: true
        });
    mainWindow.loadURL(startUrl);
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});


ipcMain.handle('nutjs', (event, arg) => {
    const [fName, ...args] = arg;
    // return console.log(arg);
    if (fName === 'configAutoDelayMs') {
        return nutjs.keyboard.config.autoDelayMs = args[0];
    }
    return nutjs.keyboard[fName](...args);
});

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const config = { delayMs: 0 };
robotjs.keyTapAsync = function (...input) {
    return new Promise(async (resolve, reject) => {
        try {
                for (const char of input.join(" ").split("")) {
                    robotjs.keyTap(...input);
                    await (0, sleep)(config.delayMs);
                }
            resolve(true);
        }
        catch (e) {
            reject(e);
        }
    });
}
robotjs.setKeyboardDelayAsync = function (value) {
    config.delayMs = value;
}
ipcMain.handle('robotjs', async (event, arg) => {
    const [fName, ...args] = arg;
    return robotjs[fName](...args);
});
// app.whenReady().then(() => {
//     // Register a 'CommandOrControl+X' shortcut listener.
//     const ret = globalShortcut.register('CommandOrControl+X', () => {
//       console.log('CommandOrControl+X is pressed')
//     })
  
//     if (!ret) {
//       console.log('registration failed')
//     }
  
//     // Check whether a shortcut is registered.
//     console.log(globalShortcut.isRegistered('CommandOrControl+X'))
//   })
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
