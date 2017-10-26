'use strict';


require('dotenv').config({path : "/usr/local/relay/.env"});
const jsonrpc = require('./src/client/jsonrpc');
const logger = require('./src/log/logger').defaultLogger;
const orderLogger = require('./src/log/logger').orderLogger;
const WebsocketClient = require('./src/client/websocket');
const program = require('commander');
const fs = require('fs');
const join = require('path').join;
const mongoose = require("mongoose");
const ethProxy = require('./src/proxy/eth');
const ipfsProxy = require('./src/proxy/ipfs');

if (!process.env.IS_PROD_MODE) {
    //load local env file .env
    require('dotenv').config();
}
logger.info("relay will running in %s mode", process.env.IS_PROD_MODE ? "PROD" : "LOCAL");
logger.info("The process config is >>>>>>>>>>>>>");
logger.info(process.env);
orderLogger.error("x............... %d", 1000);

var configs = {
    test : {
        eth: "https://infuranet.infura.io/RjAjeUYlo9jXI6J4xgyE",
        ipfs: ['localhost', '5001', {protocol: 'http'}],
        mongo : "mongodb://localhost/loopring",
        websocket : 3008
    },
    prod : {
        eth: "",
        ipfs: "",
        mongo : ""
    }
};


//==========================> start jsonrpc
jsonrpc.start(configs['test'].eth);
//TODO start websocket

//==========================> init mongoose model and mongo collection
const models = join(__dirname, 'src/model');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

mongoose.connect(configs['test'].mongo, {
    useMongoClient: true
});

//==========================> start eth proxy
ethProxy.connect(configs['test'].eth);
//==========================> start ipfs proxy
ipfsProxy.connect(configs['test'].ipfs);

console.log("   _                                                         _\n" +
    " | |    ___   ___   ___   ___   ___   ___   ___  _ __  _ __(_)_ __   __ _\n" +
    " | |   / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\| '_ \\| '__| | '_ \\ / _` |\n" +
    " | |__| (_) | (_) | (_) | (_) | (_) | (_) | (_) | |_) | |  | | | | | (_| |\n" +
    " |_____\\___/ \\___/ \\___/ \\___/ \\___/ \\___/ \\___/| .__/|_|  |_|_| |_|\\__, |\n" +
    "                                                |_|                 |___/");
