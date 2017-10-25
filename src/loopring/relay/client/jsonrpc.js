'use strict'

var jayson = require('jayson');
var orders = require('../service/orders');
var markets = require('../service/markets');
var ring = require('../service/rings');
var connect = require('connect');
var jsonParser = require('body-parser').json;
var cors = require('cors');


var methods = {
    test: function(args, callback) {
        callback(null, args[0] + args[1]);
    },
    loopring_submitOrder : function (args, callback) {
        console.log(args);
        orders.submitOrder(args, function (err, rst) {
            callback(err, rst);
        })
    },
    loopring_cancelOrder : function (args, callback) {
        console.log(args);
        orders.cancelOrder(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_getOrders : function (args, callback) {
        console.log(args);
        orders.getOrders(args, function (err, rst) {
            callback(err, rst);
        })
    },loopring_getDepth : function (args, callback) {
        console.log(args);
        markets.loopring_getDepth(args, function (rst) {
            callback(null, rst);
        })
    },loopring_getTicker : function (args, callback) {
        console.log(args);
        markets.loopring_getTicker(args, function (rst) {
            callback(null, rst);
        })
    },loopring_getFills : function (args, callback) {
        console.log(args);
        orders.getFills(args, function (rst) {
            callback(null, rst);
        })
    },
    loopring_getCandleTicks : function (args, callback) {
        console.log(args);
        markets.loopring_getCandleTicks(args, function (rst) {
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

    var ethJsonRpcClient = jayson.client.http(connection);
    var app = connect();

    var server = jayson.server(methods, {
        router: function(method, params) {
            // regular by-name routing first
            console.log(method);
            // console.log(this._methods);
            if(method.startsWith('eth_')) {
                return new jayson.Method(function(args, done) {
                    ethJsonRpcClient.request(method, args, function (err, res) {
                        // console.log("client res is");
                        // console.log(res);
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


    app.use(cors({methods: ['POST', 'GET']}));
    app.use(jsonParser());
    app.use(server.middleware());

    app.listen(3000);
};
