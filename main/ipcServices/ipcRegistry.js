const { ipcMain } = require('electron');

module.exports = function ipcRegistry(name, ipcService) {
    ipcMain.handle(name, async(event, arg) => {
        const [fName, ...args] = arg;
        // const a = ipcService[fName](...args);
        // console.log(a)
        // return a;
        return ipcService[fName](...args);
    });
}