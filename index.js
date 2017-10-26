'use strict';


require('dotenv').config({path : "/usr/local/relay/.env"});
const jsonrpc = require('./src/client/jsonrpc');
const logger = require('winston');
const WebsocketClient = require('./src/client/websocket');
const program = require('commander');
const fs = require('fs');
const join = require('path').join;
const mongoose = require("mongoose");
const ethProxy = require('./src/proxy/eth');
const ipfsProxy = require('./src/proxy/ipfs');

if (!process.env.IS_PROD_MODE) {
} else {
    //load local env file .env
    require('dotenv').config();
}
console.log("relay will running in " + (process.env.IS_PROD_MODE ? "PROD" : "LOCAL") + " mode");
console.log("The process config is >>>>>>>>>>>>>");
console.log(process.env);

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
