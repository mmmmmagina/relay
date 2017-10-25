'use strict';

var Web3 = require('web3');

var EthProxy = function () {
    this.web3 = null;
    this.contract = null;
};


EthProxy.prototype.connect = function (connection) {
    if (!this.web3) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(connection));
    }
    //TODO abi is a string to config later.
    var abi = '[{"constant":true,"inputs":[],"name":"FEE_SELECT_MAX_VALUE","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"MARGIN_SPLIT_PERCENTAGE_BASE","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addresses","type":"address[3]"},{"name":"orderValues","type":"uint256[7]"},{"name":"buyNoMoreThanAmountB","type":"bool"},{"name":"marginSplitPercentage","type":"uint8"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addressList","type":"address[2][]"},{"name":"uintArgsList","type":"uint256[7][]"},{"name":"uint8ArgsList","type":"uint8[2][]"},{"name":"buyNoMoreThanAmountBList","type":"bool[]"},{"name":"vList","type":"uint8[]"},{"name":"rList","type":"bytes32[]"},{"name":"sList","type":"bytes32[]"},{"name":"ringminer","type":"address"},{"name":"feeRecepient","type":"address"},{"name":"throwIfLRCIsInsuffcient","type":"bool"}],"name":"submitRing","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"cutoff","type":"uint256"}],"name":"setCutoff","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"FEE_SELECT_LRC","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"FEE_SELECT_MARGIN_SPLIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}]';
    if (!this.contract) {
        this.contract = this.web3.eth.contract(JSON.parse(abi));
        this.sigContractInstance =  this.contract.at('0x006effb85f24e7bee5710a4cbc62c2fbaf5f6035');
        // this.sigContractInstance.MyEvent
    }
};

EthProxy.prototype.orderFilled = function () {

};

EthProxy.prototype.exec = function(method, args, callback) {
    console.log('method is' + method);
    console.log('args is' + args);
    if (args instanceof Array && args.length === 1) {
        args = args[0];
    }

    this.web3.eth[method](args, function (err, rst) {
       if (err) {
           console.log("err is " + err);
           return "err invoke " + method;
       }
       console.log("invoke rst =============> ");
       console.log(rst);
       return callback(rst);
    });
};

module.exports = new EthProxy();