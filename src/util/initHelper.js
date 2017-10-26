'use strict';

var promise = require('bluebird');
var logger = require('../log/logger').defaultLogger;
var mongoose = require('mongoose');
var jsonrpc = require('../client/jsonrpc');

exports.loadEnv = function (args, callback) {

    logger.info("start load env from .env file...");

    if (!process.env.IS_PROD_MODE) {
        //load local env file .env
        logger.info("prod env file not found...");
        require('dotenv').config();
    }

    logger.info("relay will running in %s mode", process.env.IS_PROD_MODE ? "PROD" : "LOCAL");
    logger.info("The process config is : ");
    logger.info(process.env);
    callback();
};

exports.initMongoose = function (conn, modelDir) {

    logger.info(">>>>>>>>>>> start init mongoose for connection : %s, model dir : %s", conn, modelDir);

    if (!conn || !modelDir) {
        logger.info("conn or model dir is undefined");
        return;
    }

    const models = join(__dirname, model);
    fs.readdirSync(models)
        .filter(file => ~file.search(/^[^\.].*\.js$/))
        .forEach(file => require(join(models, file)));

    mongoose.connect(arg, {
        useMongoClient: true
    });

    logger.info(">>>>>>>>>>> end init mongoose");
};

exports.initJsonRpc = function (port, ethAgentManager) {
    logger.info('start initJsonRpc');
    jsonrpc.init(port, ethAgentManager);
    logger.info("end initJsonRpc");
};
