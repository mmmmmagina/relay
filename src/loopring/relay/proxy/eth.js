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
    var abi = '';
    if (!this.contract) {
        this.contract = this.web3.eth.contract(JSON.parse(abi));
        this.sigContractInstance =  this.contract.at('0xksdfjsdfjk')
    }
};

EthProxy.prototype.exec = function(method, args, callback) {
    console.log('method is' + method);
    console.log('args is' + args);
    var preRemoved = method.substr("eth_".length);
    console.log("preRemoved : " + preRemoved)
    if (args instanceof Array && args.length === 1) {
        args = args[0];
    }

    this.web3.eth[preRemoved](args, function (err, rst) {
       if (err) {
           console.log("err is " + err);
           return "err invoke " + method;
       }
       console.log("invoke rst =============> ");
       console.log(rst);
       return callback(rst);
    });
};

module.exports = new EthProxy;