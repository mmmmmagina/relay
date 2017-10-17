'use strict'

var ipfsProxy = require('../proxy/ipfs');
const ABI = require('ethereumjs-abi');
var BigNumber = require('bignumber.js');
const ethProxy = require('../proxy/eth');

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

    var verifyRst = verify(input);
    if (!verifyRst) {
        callback("auth failed.");
    } else {
        ethProxy.exec("")
        // 1. send eth tx to cancel
        // 2. if 1 success , update order status to Cancelled in db
        // 3. broadcast order cancelled


        ipfsProxy.publish(input, function (result) {
            callback(result);
        });
    }
};

function verify(input) {
    return true;
}
