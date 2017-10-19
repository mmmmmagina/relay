'use strict'

var IpfsProxy = require('../proxy/ipfs');
var BigNumber = require('bignumber.js');
var ethProxy = require('../proxy/eth');
var Util = require('../util/util');
var mongoose = require('mongoose');
var OrderSchema = require('../model/order').OrderSchema;
var Order = mongoose.model('Order', OrderSchema);
var Validator = require('../util/validator');


var Orders = function () {
};

Orders.prototype.needFormatFields = ['timestamp', 'ttl', 'lrcFee'];

Orders.prototype.loopring_submitOrder = function (input, callback) {

    var isValidSign = Validator.isValidSignature(input);
    if (!isValidSign) {
        callback("not valid order submitted");
        return;
    }

    Util.generateOrderHash(input);
    var hexFormatOrder = this.formatFromHex(input);
    IpfsProxy.publish(IpfsProxy.topics.orderSubmittedTopic, hexFormatOrder, function (err) {
        if (!err) {
            var order = new Order(input);
            order.save(function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback("SUBMIT_SUCCESS");
                }
            });
        }
    });
};

Orders.prototype.loopring_cancelOrder = function (input, callback) {
    console.log('input params is ========> ');
    console.log(input);

    var isValidSign = Validator.isValidSignature(input);
    if (!isValidSign) {
        callback("not valid order submitted");
        return;
    }


    ethProxy.exec("");
    // 1. send eth tx to cancel
    // 2. if 1 success , update order status to Cancelled in db
    // 3. broadcast order cancelled


    ipfsProxy.publish(input, function (result) {
        callback(result);
    });
};


Orders.prototype.formatToHex = function (order) {
    var hexFormattedOrder = JSON.parse(JSON.stringify(order));
    this.needFormatFields.forEach(function (k) {

        if (k === 'lrcFee') {
            var lrcFeeBig = new BigNumber(hexFormattedOrder[k]);
            hexFormattedOrder[k] = "0x" + lrcFeeBig.mul(10e18).toString(16);
        } else {
            hexFormattedOrder[k] = "0x" + order[k].toString(16);
        }
    });

    return hexFormattedOrder;
};

Orders.prototype.formatFromHex = function (hexFormattedOrder) {
    var unFormatOrder = JSON.parse(JSON.stringify(hexFormattedOrder));
    this.needFormatFields.forEach(function (k) {

        var bigNumber = new BigNumber(hexFormattedOrder[k]);
        if (k === 'lrcFee') {
            unFormatOrder[k] = bigNumber.div(10e18).toNumber();
        } else {
            unFormatOrder[k] = bigNumber.toNumber();
        }
    });

    return unFormatOrder;
};

module.exports = new Orders();
