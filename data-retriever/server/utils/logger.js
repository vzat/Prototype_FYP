const fs = require('fs');
const winston = require('winston');
const logPath = __dirname + '/../../logs/';
const timestamp = (new Date()).toISOString().replace(/:/g, '-');

if (!fs.existsSync(logPath)) {
    fs.mkdirSync(logPath);
}

winston.add(winston.transports.File, { filename: logPath + 'monGUI_' + timestamp + '.log' });

module.exports = winston;
