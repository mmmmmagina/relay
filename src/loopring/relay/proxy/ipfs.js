'use strict'

var ipfsAPI = require('ipfs-api');
const mongoose = require('mongoose');
const OrderTransfer = require("../model/order");
const OrderSchema = require('../model/order').OrderSchema;
const Order = mongoose.model('Order', OrderSchema);
const BigNumber = require('bignumber.js');
const ABI = require('ethereumjs-abi');
const ethUtil = require('ethereumjs-util');


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
    // console.log('receive order into =======> ');
    // console.log(order);

    var toSave = new Order(order);

    var ipfsConvertSet = ['timestamp', 'ttl', 'lrcFee'];
    ipfsConvertSet.forEach(k => {
        if (k == 'lrcFee') {
        var lrcFeeBig = new BigNumber(order[k]);
        order[k] = "0x" + lrcFeeBig.mul(10e18).toString(16);
        } else {
            order[k] = "0x" + order[k].toString(16);
        }
    })

    var orderHash = generateOrderHash(order);
    toSave.orderHash = order.orderHash;
    console.log(toSave);
    ipfs.pubsub.publish("LOOPRING_ORDER_SUBMITTED_0XJD7JDX6KS", Buffer.from(JSON.stringify(order)), (err) => {
        if (err) {
            callback("broadcast failed " + err);
        }
        console.log("broadcast success");
        toSave.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
        callback("broadcast success");
    });
};

const orderSubmitted = (msg) => {
    console.log("subscribe messsssssssssage received");
    var conveted = JSON.parse(msg.data.toString());
    // var order = new Order(conveted);
    // order.toIpfsMsg;
    // console.log(conveted);

    // order.save(function (err) {
    //     if (err) {
    //         console.log(err);
    //     }
    // });
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
    LOOPRING_ORDER_SUBMITTED_0XJD7JDX6KS : orderSubmitted,
    LOOPRING_ORDER_CANCELED_98XJDK7J2JJ4 : orderCanceled
};

function generateOrderHash(input) {
    const orderHash = solSHA3([
        input.protocol,
        input.owner,
        input.tokenS,
        input.tokenB,
        input.amountS,
        input.amountB,
        input.timestamp,
        input.ttl,
        input.salt,
        input.lrcFee,
        input.buyNoMoreThanAmountB,
        input.marginSplitPercentage
    ]);
    input.orderHash = orderHash;

}

function solSHA3(args) {
    var argTypes = [];
    args.forEach((arg, i) => {
        if (typeof arg=="number") {
            argTypes.push('uint8');
        } else if (ethUtil.isValidAddress(arg)) {
            argTypes.push('address');
        } else if (typeof arg=="string") {
            argTypes.push('string');
        } else if  (typeof arg=="boolean") {
            argTypes.push('bool');
        } else {
            throw new Error(`Unable to guess arg type: ${arg}`);
        }
    });
    const hash = ABI.soliditySHA3(argTypes, args);
    return ethUtil.bufferToHex(hash);
}

module.exports.start = (connection) => {

    if (!ipfs) {
        ipfs = ipfsAPI(connection);
    }

    Object.keys(topics).forEach(function (k) {
       ipfs.pubsub.subscribe(k, topics[k]);
    })
}
