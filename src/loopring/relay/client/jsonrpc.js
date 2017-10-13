'use strict'

var jayson = require('jayson');
var orders = require('../service/orders');
var market = require('../service/markets');
var ring = require('../service/rings');

var methods = {
    test: function(args, callback) {
        callback(null, args[0] + args[1]);
    },
    loopring_submitOrder : function (args, callback) {
        console.log(args);
        orders.loopring_submitOrder(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_cancelOrder : function (args, callback) {
        console.log(args);
        orders.loopring_cancelOrder(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_getOrders : function (args, callback) {
        console.log(args);
        orders.loopring_getOrders(args, function (rst) {
            callback(null, rst);
        })
    },loopring_getDepth : function (args, callback) {
        console.log(args);
        market.loopring_getDepth(args, function (rst) {
            callback(null, rst);
        })
    },loopring_getTicker : function (args, callback) {
        console.log(args);
        market.loopring_getTicker(args, function (rst) {
            callback(null, rst);
        })
    },loopring_getFills : function (args, callback) {
        console.log(args);
        orders.loopring_getFills(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_getCandleTicks : function (args, callback) {
        console.log(args);
        market.loopring_getCandleTicks(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_getRingsMined : function (args, callback) {
        console.log(args);
        ring.loopring_getRingsMined(args, function (rst) {
            callback(null, rst);
        })
    }

};


module.exports.start = function(connection) {

    var ethJsonRpcClient = jayson.client.https(connection);

    var server = jayson.server(methods, {
        router: function(method, params) {
            // regular by-name routing first
            console.log(method);
            console.log(this._methods);
            if(method.startsWith('eth_')) {
                return new jayson.Method(function(args, done) {
                    ethJsonRpcClient.request(method, args, function (err, res) {
                        console.log("client res is");
                        console.log(res);
                        if (err) throw err;
                        done(null, res.result);
                    })
                    // web3 version
                    // ethProxy.exec(method, args, function (rst) {
                    //     done(null, rst);
                    // });
                });
            }
            if(this._methods[method]) return this._methods[method];
        }
    });


    server.http().listen(3000);
};
