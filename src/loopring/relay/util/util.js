'use strict';

var ABI = require('ethereumjs-abi');
var ethUtil = require('ethereumjs-util');

var Util = function () {
};

Util.prototype.generateOrderHash = function (input) {
    var buffer = this.generateHashBuffer(input);
    input.orderHash = ethUtil.bufferToHex(buffer);
};

Util.prototype.generateHashBuffer = function (input) {
    return solSHA3([
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
};

function solSHA3(args) {
    var argTypes = [];
    args.forEach(function (arg) {
        if (typeof arg === "number") {
            argTypes.push('uint8');
        } else if (ethUtil.isValidAddress(arg)) {
            argTypes.push('address');
        } else if (typeof arg === "string") {
            argTypes.push('string');
        } else if (typeof arg === "boolean") {
            argTypes.push('bool');
        } else {
            throw "Unable to guess arg type: " + arg;
        }
    });

    return ABI.soliditySHA3(argTypes, args);
}

module.exports = new Util();