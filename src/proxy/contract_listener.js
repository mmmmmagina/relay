'use strict';

var Web3 = require('web3');
var consts = require('../constants/const');
var RingMined = require('../model/ring_mined');
var OrderFilled = require('../model/order_filled');
var OrderService = require('../service/orders');
var redisProxy = require('./redis-proxy').RedisProxy;

var ContractListener = function (redisProxy) {
    this.web3 = null;
    this.contract = null;
    this.redisProxy = redisProxy;
};

ContractListener.prototype.connect = function (connection) {
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


ContractListener.prototype.exec = function(method, args, callback) {
    console.log('method is' + method);
    console.log('args is' + args);
    var preRemoved = method.substr("eth_".length);
    console.log("preRemoved : " + preRemoved);
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

ContractListener.prototype.startWatch = function() {
    var events = this.sigContractInstance.allEvents();
    events.watch(function(error, event){
        if (!error)
            console.log(event);

        var eventName = event.name;
        switch (eventName) {
            case consts.LoopringProtocolEventType.RING_MINED:

                var ringMined = new RingMined(event);
                ringMined.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("insert success");
                    }
                });

                break;
            case consts.LoopringProtocolEventType.ORDER_FILLED:
                var orderFilled = new OrderFilled(event);
                orderFilled.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("insert success");
                        redisProxy.updateCandleTicker(event);
                        redisProxy.updateDepth(event);
                    }
                });
                break;
            case consts.LoopringProtocolEventType.ORDER_CANCELLED:
                OrderService.loopring_cancelOrder(event, function (data) {
                    redisProxy.updateDepth(event);
                });
                break;
            case consts.LoopringProtocolEventType.CUTOFF_TIMESTAMP_CHANGED:
                var address = event.address;
                var time = event._time; //block generate time;
                var cutOff = event._cutoff;
                var blockNumber = event.blockNumber;
                OrderService.cancelAllOrders(address, cutOff);
                break;
        }
    });
};

module.exports = ContractListener;