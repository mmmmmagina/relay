'use strict';

var winston = require('winston');
require('winston-daily-rotate-file');

var createWithDefaultConfig = function (name) {
   return new winston.Logger({
       level : 'debug',
       colorize: true,
       transports : [
           new (winston.transports.Console)({
               colorize: true,
               timestamp : function () {
                   return new Date().toLocaleString()
               }

           }),
           new (winston.transports.DailyRotateFile)({
               filename: name,
               datePattern: 'yyyy-MM-dd.',
               prepend: true,
               colorize: false,
               json : false,
               timestamp : function () {
                   return new Date().toLocaleString();
               },
               formatter : function(options) {
                   return options.timestamp() + ' - [' +
                       options.level.toUpperCase() + '] ' +
                       (options.message ? options.message : '') +
                       (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
               }
               // this line will open after published. level: process.env.IS_LOCAL_ENV ? 'debug' : 'info'
           })
       ]
   });
};

exports.defaultLogger = createWithDefaultConfig('relay-sys.log');
exports.orderLogger = createWithDefaultConfig('order.log');
exports.marketLogger = createWithDefaultConfig('market.log');
exports.ringLogger = createWithDefaultConfig('ring.log');
exports.redisLogger = createWithDefaultConfig('redis.log');
