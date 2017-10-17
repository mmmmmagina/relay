'use strict'

var ipfsProxy = require('../proxy/ipfs');
const ABI = require('ethereumjs-abi');
var BigNumber = require('bignumber.js');

module.exports.loopring_submitOrder = function(input, callback) {
    // console.log('input params is ========> ');
    // console.log(input);
    ipfsProxy.publish(input, function (result) {
        callback(result);
    });
};

module.exports.loopring_cancelOrder = function(input, callback) {
    console.log('input params is ========> ');
    console.log(input);
    ipfsProxy.publish(input, function (result) {
        callback(result);
    });
};

