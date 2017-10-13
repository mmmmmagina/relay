'use strict'

const Web3 = require('web3');

var web3 = null;

module.exports.sendRawTx = function(tx) {
    console.log('send raw transaction' + tx);
    return "send success";
};

module.exports.exec = function(method, args, callback) {
    console.log('method is' + method);
    console.log('args is' + args);
    var preRemoved = method.substr("eth_".length);
    console.log("preRemoved : " + preRemoved)
    if (args instanceof Array && args.length === 1) {
        args = args[0];
    }
    web3.eth[preRemoved](args, function (err, rst) {
       if (err) {
           console.log("err is " + err);
           return "err invoke " + method;
       }
       console.log("invoke rst =============> ");
       console.log(rst);
       return callback(rst);
    });
};

module.exports.start = function(connection) {
    if (!web3) {
        web3 = new Web3(new Web3.providers.HttpProvider(connection));
    }
};
