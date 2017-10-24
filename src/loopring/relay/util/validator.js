'use strict';

var Util = require('./util');
var ethUtil = require('ethereumjs-util');

var Validator = function () {
};

Validator.prototype.isValidSignature = function(order) {
    var {v, r, s} = order;
    if (!v || !r || !s) {
        throw 'Cannot call isValidSignature on unsigned order';
    }
    var hashBuffer = Util.generateHashBuffer(order);
    var msgHash = ethUtil.hashPersonalMessage(hashBuffer);
    console.log("msgHash:", ethUtil.bufferToHex(msgHash));
    try {
        var pubKey = ethUtil.ecrecover(msgHash, v, ethUtil.toBuffer(r), ethUtil.toBuffer(s));
        var recoveredAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(pubKey));
        console.log(recoveredAddress);
        console.log(order.owner);
        return recoveredAddress.toLowerCase() === order.owner.toLowerCase();
    } catch (err) {
        return false;
    }
};


module.exports = new Validator();