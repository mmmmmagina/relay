'use strict';

var logger = require('../log/logger').defaultLogger;
var mongoose = require('mongoose');
var jsonrpc = require('../client/jsonrpc');
var join = require('path').join;
var fs = require('fs');
var redisProxy = require('../proxy/redis-proxy');

exports.env = function () {
    logger.info("========> Start load env from .env file...");

    if (!process.env.IS_PROD_MODE) {
        //load local env file .env
        logger.info("Prod env file not found. relay will running in LOCAL mode");
        require('dotenv').config();
    }

    logger.info("Now relay is running in %s mode", process.env.IS_PROD_MODE ? "PROD" : "LOCAL");
    logger.info("The process config is : ");
    logger.info(process.env);
    logger.info("========> Loading env successfully.");
};

exports.mongoose = function () {

    var conn = process.env.MONGO_CONN;
    var modelDir = '../model';

    logger.info("========> Start init mongoose with connection : %s, model dir : %s", conn, modelDir);

    if (!conn || !modelDir) {
        logger.info("Conn or model dir is undefined");
    } else {

        const models = join(__dirname, modelDir);

        fs.readdirSync(models)
            .filter(function(file) {
                ~file.search(/^[^\.].*\.js$/);
            })
            .forEach(function(file) {
                require(join(models, file));
            });

        mongoose.connect(conn, {
            useMongoClient: true
        });

        logger.info("========> Init mongoose successfully");
    }
};

exports.redis = function () {
    var host = process.env.REDIS_HOST;
    var port = process.env.REDIS_PORT;
    logger.info("========> start init redis for host : %s, port : %s", host, port);
    redisProxy.init({host: host, port : port, name : "relayRedisProxy"});
    logger.info("========> end init redis");
};

exports.initJsonRpc = function (port, ethAgentManager) {
    logger.info('start initJsonRpc');
    jsonrpc.init(port, ethAgentManager);
    logger.info("end initJsonRpc");
};
