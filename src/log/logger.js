'use strict';

var winston = require('winston');

exports.defaultLogger = new winston.Logger({
    level : 'debug',
    transports : [
        new (winston.transports.Console)(),
        new (winston.transports.File)({filename: "relay.log"})
    ]
});