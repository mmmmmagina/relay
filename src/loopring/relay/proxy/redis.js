'use strict';

var redis = require("redis");

// if you'd like to select database 3, instead of 0 (default), call
// client.select(3, function() { /* ... */ });

//TODO read config from index.js
var RedisProxy = function (config) {
    this.client = redis.createClient(["127.0.0.1", 6397]);
};


RedisProxy.prototype.updateCandleTicker = function(orderFilled) {

};

RedisProxy.prototype.updateDepth = function (orderFilled) {

};

module.exports = RedisProxy;