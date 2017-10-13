'use strict'

var ipfsAPI = require('ipfs-api');
const mongoose = require('mongoose');
const OrderSchema = require('../model/order').OrderSchema;
const Order = mongoose.model('Order', OrderSchema);

// connect to ipfs daemon API server
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'}) // leaving out the arguments will default to these values
// // or connect with multiaddr
// var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')
//
// // or using options
// var ipfs = ipfsAPI({host: 'localhost', port: '5001', protocol: 'http'})


var IpfsAgent = module.exports = function (config) {
   this.connection =  ipfsAPI('localhost', '5001', {protocol: 'http'});
};

var ipsf = null;

module.exports.publish = function(order, callback) {
    console.log('receive order into =======> ');
    console.log(order);
    ipfs.pubsub.publish(topics.LOOPRING_ORDER_SUBMITTED, Buffer.from(JSON.stringify(order)), (err) => {
        if (err) {
            callback("broadcast failed " + err);
        }
        console.log("broadcast success");
        callback("broadcast success");
    });
};

const orderSubmitted = (msg) => {
    console.log("subscribe messsssssssssage received");
    var conveted = JSON.parse(msg.data.toString());
    var order = new Order(conveted);
    console.log(order);

    order.save(function (err) {
        console.log("saved ?????");
        console.log(err);
    });
}

const orderCanceled = (msg) => {
    console.log("subscribe messsssssssssage received");
    var id = msg.data.id;

    var order = new Order(conveted);
    console.log(order);

    order.save(function (err) {
        console.log("saved ?????");
        console.log(err);
    });
}

var topics = module.exports.topics = {
    LOOPRING_ORDER_SUBMITTED : orderSubmitted,
    LOOPRING_ORDER_CANCELED : orderCanceled
};

module.exports.start = (connection) => {

    if (!ipfs) {
        ipfs = ipfsAPI(connection);
    }

    Object.keys(topics).forEach(function (k) {
       ipfs.pubsub.subscribe(k, topics[k]);
    })
}
