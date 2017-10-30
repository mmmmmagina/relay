'use strict';

var RedisPool = require('redis-connection-pool');
var util = require("util");
var EventEmitter = require("events").EventEmitter;
var consts = require('../constants/const');

var RedisProxy = function (config) {
    EventEmitter.call(this);
    this.config = config;
    this.redisPool = RedisPool(config.name, {
        host : config.host,
        port : config.port,
        max_clients: 20,
        database: 0
        // not use password now
        // options: {
        //     auth_pass: 'password'
        // }
    });
};

util.inherits(RedisProxy, EventEmitter);

RedisProxy.prototype.getDepth = function (tokenPair, length, callback) {
    if (typeof length !== 'number' || length < 0) {
        length = 10;
    }
    var mockDepthData = {
        "market" : "lrc-eth",
        "depth" : {
            "buy" : [
                ["0x2acd38d8ef93", "0x2acd38d8ef93"], ["0x2acd38d8ef93", "0x2acd38d8ef93"], ["0x2acd38d8ef93", "0x2acd38d8ef93"]
            ],
            "sell" : [
                ["0x2acd38d8ef93", "0x2acd38d8ef93"], ["0x2acd38d8ef93", "0x2acd38d8ef93"], ["0x2acd38d8ef93", "0x2acd38d8ef93"]
            ]
        }
    };
    callback(null, mockDepthData);
};

RedisProxy.prototype.getTicker = function (tokenPair, length, callback) {

};

RedisProxy.prototype.getCandleTicks = function (tokenPair, length, callback) {

};

RedisProxy.prototype.on(consts.LoopringProtocolEventType.ORDER_FILLED, function (event) {
    // update depth
    // update market
    arguments.forEach(a => {console.log(a);});
});

RedisProxy.prototype.on(consts.LoopringProtocolEventType.ORDER_CANCELLED, function (event) {
    // update depth
});

RedisProxy.prototype.on(consts.LoopringProtocolEventType.CUTOFF_TIMESTAMP_CHANGED, function (event) {
    // update depth
});

RedisProxy.prototype.on(consts.RelayEventType.SUBMIT_ORDER, function (event) {
    // update depth
});

module.exports.init = function (config) {
   module.exports.RedisProxy = new RedisProxy(config);
};
