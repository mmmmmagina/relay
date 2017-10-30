'use strict';

var IpfsAPI = require('ipfs-api');
var mongoose = require('mongoose');
var OrderSchema = require('../model/order').OrderSchema;
var Order = mongoose.model('Order', OrderSchema);
var Validator = require('../util/validator');
var Const = require('../constants/const');


var IpfsProxy = function () {
    this.agent = null;
};

IpfsProxy.prototype.topics = {
    orderSubmittedTopic: "LOOPRING_ORDER_SUBMITTED_0XJD7JDX6KS",
    orderCancelledTopic: "LOOPRING_ORDER_CANCELLED_98XJDK7J2JJ4"
};

IpfsProxy.prototype.connect = function (connection) {
    if (!this.agent) {
        this.agent = IpfsAPI(connection);
    }
    // subscribe order cancel topic
    this.agent.pubsub.subscribe(this.topics.orderCancelledTopic, this.orderCanceled);
};

IpfsProxy.prototype.publish = function (topic, order, callback) {
    this.agent.pubsub.publish(topic, Buffer.from(JSON.stringify(order)), function (err) {
        callback(err);
    });
};

IpfsProxy.prototype.orderCanceled = function (msg) {
    var formattedOrder = JSON.parse(msg.data.toString());

    var validateRst = Validator.isValidSignature(formattedOrder);
    if (validateRst) {
        var toCancelOrder = new Order(formattedOrder);
        toCancelOrder.cancel(Const.OrderStatus.CANCELLED);
    } else {
        console.log("order validate failed");
    }
};

module.exports.init = function (conn) {
    var ipfsProxy = new IpfsProxy();
    ipfsProxy.connect(conn);
    module.exports.IpfsProxy = ipfsProxy;
};
