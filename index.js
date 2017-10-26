'use strict';


require('dotenv').config({path : "/usr/local/relay/.env"});
const jsonrpc = require('./src/client/jsonrpc');
const logger = require('./src/log/logger').defaultLogger;
const WebsocketClient = require('./src/client/websocket');
const program = require('commander');
const fs = require('fs');
const join = require('path').join;
const mongoose = require("mongoose");
const ethProxy = require('./src/proxy/eth');
const ipfsProxy = require('./src/proxy/ipfs');
const Promise = require('bluebird');
const initHelper = require('./src/util/initHelper');

Promise.promisifyAll(initHelper);

// the order is bottom up
start()
    .then(initHelper.loadEnvAsync)
    .then(initHelper.initMongooseAsync(process.env.MONGO_CONN, "../src/model"))
    .then(initHelper.initJsonRpc)
    .then(function (resolve) {
        logger.info("==========> finish init project");
        resolve("finish");
    })
    .catch(function (err) {
       logger.error("some error occur when init project...");
       logger.error(err);
    });


//==========================> start jsonrpc
// jsonrpc.start(configs['test'].eth);
// //TODO start websocket
//
// //==========================> init mongoose model and mongo collection
//
//
// //==========================> start eth proxy
// ethProxy.connect(configs['test'].eth);
// //==========================> start ipfs proxy
// ipfsProxy.connect(configs['test'].ipfs);

console.log("   _                                                         _\n" +
    " | |    ___   ___   ___   ___   ___   ___   ___  _ __  _ __(_)_ __   __ _\n" +
    " | |   / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\| '_ \\| '__| | '_ \\ / _` |\n" +
    " | |__| (_) | (_) | (_) | (_) | (_) | (_) | (_) | |_) | |  | | | | | (_| |\n" +
    " |_____\\___/ \\___/ \\___/ \\___/ \\___/ \\___/ \\___/| .__/|_|  |_|_| |_|\\__, |\n" +
    "                                                |_|                 |___/");


function start() {
    return new Promise(function (resolve) {
        logger.info("==========> start init project");
        resolve('start');
    });
}
