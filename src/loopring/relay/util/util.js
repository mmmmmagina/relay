'use strict';

var ABI = require('ethereumjs-abi');
var ethUtil = require('ethereumjs-util');
var BigNumber = require('bignumber.js');
var BN = require('bn.js');

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
        new BigNumber(input.amountS),
        new BigNumber(input.amountB),
        new BigNumber(input.timestamp),
        new BigNumber(input.ttl),
        new BigNumber(input.salt),
        new BigNumber(input.lrcFee),
        input.buyNoMoreThanAmountB,
        input.marginSplitPercentage
    ]);
};

function solSHA3(args) {
    var argTypes = [];
    console.log(args);
    args.forEach(function (arg, i) {

        if (arg instanceof BigNumber) {
            argTypes.push('uint256');
            args[i] = new BN(arg.toString(10), 10);
        } else if (typeof arg === "number") {
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
    console.log(argTypes);

    return ABI.soliditySHA3(argTypes, args);
}

module.exports = new Util();