'use strict';

var IpfsProxy = require('../proxy/ipfs');
var BigNumber = require('bignumber.js');
var ethProxy = require('../proxy/eth');
var Util = require('../util/util');
var mongoose = require('mongoose');
var OrderFilled = require('../model/order_filled');
var Validator = require('../util/validator');
var redisProxy = require("../proxy/redis");
var consts = require("../constants/const");

var Fills = function () {
};

Fills.prototype.getFills = function (query, callback) {

};

Fills.prototype.insertFill = function (fill) {
    var orderFilled = new OrderFilled(fill);
    console.log(orderFilled);
    orderFilled.save(function (e) {
        console.log(e);
    })
};

module.exports = new Fills();
