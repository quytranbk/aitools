const fsPromises = require('fs/promises');

module.exports = fsPromises;
module.exports.isFile = async function (path) {
    const stat = await fsPromises.stat(path);
    return stat.isFile();
}