'use strict'

var IpfsProxy = require('../proxy/ipfs');
var BigNumber = require('bignumber.js');
var ethProxy = require('../proxy/eth');
var Util = require('../util/util');
var Order = require('../model/order');
var validator = require('../util/validator');
var OrderStatus = require('../constants/const').OrderStatus;

var needFormatFields = ['timestamp', 'ttl', 'lrcFee'];

exports.submitOrder = function (input, callback) {

    var isValidSign = validator.isValidSignature(input);
    if (!isValidSign) {
        callback({code: -6666661, message: 'not valid order submitted!'});
        return;
    }

    Util.generateOrderHash(input);
    var hexFormatOrder = formatFromHex(input);
    IpfsProxy.publish(IpfsProxy.topics.orderSubmittedTopic, hexFormatOrder, function (err) {
        if (!err) {
            var order = new Order(input);
            order.status = OrderStatus.PENDING;
            order.save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(null, "SUBMIT_SUCCESS");
                }
            });
        }
    });
};

exports.cancelOrder = function (input, callback) {
    console.log('input params is ========> ');
    console.log(input);

    var isValidSign = validator.isValidSignature(input);
    if (!isValidSign) {
        callback({code: -6666661, message: 'not valid sign!'});
        return;
    }


    Util.generateOrderHash(input);
    Order.findOne({orderHash : input.orderHash}, function (err, order) {
        if (err) {
            callback(err);
        } else if (!order) {
            callback({code : -6668881, message: "not found order by hash " + input.orderHash});
        } else {
            if (order.status === OrderStatus.CANCELLED || order.status === OrderStatus.EXPIRED || order.status === OrderStatus.FULLY_EXECUTED) {
                callback({code : -6668882, message: "order has already been " + order.status.toLowerCase()});
            } else if (order.status === OrderStatus.PENDING) {
                Order.findOneAndUpdate({orderHash : input.orderHash}, {status : OrderStatus.CANCELLED}, null, function (err, order) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, "CANCEL_SUCCESS");
                    }
                });
            } else if (order.status === OrderStatus.PARTIALLY_EXECUTED) {
                ethProxy.exec('sendRawTransaction', input.rawTx, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, "SUBMIT_CANCEL_SUCCESS");
                    }
                });
            } else {
                callback({code : -6668883, message: "illegal status " + order.status});
            }
        }

    });

};

exports.getFills = function () {

};

exports.cancelAllOrders = function () {

};

exports.getOrders = function (query, callback) {
    console.log("get orders input query " + query.toString());
    var {owner, status, pageIndex, pageSize} = query;

    var page = pageIndex > 0 ? pageIndex : 1;
    var limit = pageSize > 0 && pageSize <= 50 ? pageSize : 20;
    var criteria = {};
    if (owner) {
        criteria.owner = owner;
    }
    if (status) {
        criteria.status = status;
    }

    console.log("query start");
    Order.paginate(criteria, { page : page, limit : limit }, function (err, result) {
        console.log("query result is " + err);
        console.log("query result is " + result.toString);
        callback(err, result);
    });
};

exports.formatToHex = function (order) {
    var hexFormattedOrder = JSON.parse(JSON.stringify(order));
    needFormatFields.forEach(function (k) {

        if (k === 'lrcFee') {
            var lrcFeeBig = new BigNumber(hexFormattedOrder[k]);
            hexFormattedOrder[k] = "0x" + lrcFeeBig.mul(10e18).toString(16);
        } else {
            hexFormattedOrder[k] = "0x" + order[k].toString(16);
        }
    });

    return hexFormattedOrder;
};

exports.formatFromHex = function (hexFormattedOrder) {
    var unFormatOrder = JSON.parse(JSON.stringify(hexFormattedOrder));
    needFormatFields.forEach(function (k) {

        var bigNumber = new BigNumber(hexFormattedOrder[k]);
        if (k === 'lrcFee') {
            unFormatOrder[k] = bigNumber.div(10e18).toNumber();
        } else {
            unFormatOrder[k] = bigNumber.toNumber();
        }
    });

    return unFormatOrder;
};
