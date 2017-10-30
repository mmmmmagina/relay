'use strict';

const logger = require('./src/log/logger').defaultLogger;
const _ = require('./src/util/start-helper');

console.log("   _                                                         _\n" +
    " | |    ___   ___   ___   ___   ___   ___   ___  _ __  _ __(_)_ __   __ _\n" +
    " | |   / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\| '_ \\| '__| | '_ \\ / _` |\n" +
    " | |__| (_) | (_) | (_) | (_) | (_) | (_) | (_) | |_) | |  | | | | | (_| |\n" +
    " |_____\\___/ \\___/ \\___/ \\___/ \\___/ \\___/ \\___/| .__/|_|  |_|_| |_|\\__, |\n" +
    "                                                |_|                 |___/");

// the order is bottom up
start()
    .then(_.env)
    .then(_.mongoose)
    .then(_.redis)
    // .then(_.agentManager)
    .then(_.websocket)
    .then(_.jsonrpc)
    .then(function () {
        logger.info("==========> Init relay successful");
    })
    .catch(function (err) {
       logger.error("some error occur when init project...");
       logger.error(err);
    });

function start() {
    return new Promise(function (resolve) {
        logger.info("==========> Start init project");
        resolve('start');
    });
}
