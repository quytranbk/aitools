const robotjs = require('robotjs');

module.exports = robotjs;
robotjs.setKeyboardDelay(0);

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
const config = { delayMs: 0 };
module.exports.keyTapAsync = function (input) {
    return new Promise(async (resolve, reject) => {
        try {
            robotjs.keyTap(input);
            await (0, sleep)(config.delayMs);
            resolve(true);
        }
        catch (e) {
            reject(e);
        }
    });
}
module.exports.keyToggleAsync = function (...input) {
    return new Promise(async (resolve, reject) => {
        try {
            robotjs.keyToggle(...input);
            await (0, sleep)(config.delayMs);
            resolve(true);
        }
        catch (e) {
            reject(e);
        }
    });
}
module.exports.setKeyboardDelayAsync = function (value) {
    config.delayMs = value;
}