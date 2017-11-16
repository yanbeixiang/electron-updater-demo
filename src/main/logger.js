const winston = require('winston');
const path  = require('path');

const { Logger, transports } = winston;

var logger = new (Logger)({
    level: 'info',
    transports: [
        new (transports.Console)(),
        new (transports.File)({ filename: path.normalize('E:\\mqms\\new\\mqms_scenario_editor\\somefile.log') })
    ]
});

module.exports = logger;