'use strict'


require('dotenv').config();

const jsonrpc = require('./client/jsonrpc');
const WebsocketClient = require('./client/websocket');
const program = require('commander');
const fs = require('fs');
const join = require('path').join;
const mongoose = require("mongoose");
const ethProxy = require('./proxy/eth');
const ipfsProxy = require('./proxy/ipfs');


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

var mode = "";

program.parse(process.argv);
if (program.args.length == 1) {
    mode = program.args[0];
    if (mode !== "test" && mode !== "prod") {
        console.log("wrong mode, please try test|prod");
        return;
    }
} else {
    console.log("wrong input length , please try : node index.js MODE (test|prod)");
    return;
}

//==========================> start jsonrpc
jsonrpc.start(configs[mode].eth);
//TODO start websocket

//==========================> init mongoose model and mongo collection
const models = join(__dirname, 'model');
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));

mongoose.connect(configs[mode].mongo, {
    useMongoClient: true
});

//==========================> start eth proxy
ethProxy.connect(configs[mode].eth);
//==========================> start ipfs proxy
ipfsProxy.connect(configs[mode].ipfs);

console.log("   _                                                         _\n" +
    " | |    ___   ___   ___   ___   ___   ___   ___  _ __  _ __(_)_ __   __ _\n" +
    " | |   / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\ / _ \\| '_ \\| '__| | '_ \\ / _` |\n" +
    " | |__| (_) | (_) | (_) | (_) | (_) | (_) | (_) | |_) | |  | | | | | (_| |\n" +
    " |_____\\___/ \\___/ \\___/ \\___/ \\___/ \\___/ \\___/| .__/|_|  |_|_| |_|\\__, |\n" +
    "                                                |_|                 |___/");
