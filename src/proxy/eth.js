'use strict';

var Web3 = require('web3');
require('ethereum-web3-plus');
var consts = require('../constants/const');
var RingMined = require('../model/ring_mined');
var OrderFilled = require('../model/order_filled');
var OrderService = require('../service/orders');
var redisProxy = require('./redis-proxy').RedisProxy;
var EventEmitter = require("events").EventEmitter;
var util = require("util");
var EthereumBlocks = require('ethereum-blocks');

var EthProxy = function (conn) {
    EventEmitter.call(this);
    this.web3 = null;
    this.contractName = "";
    this.contract = null;
    this.redisProxy = redisProxy;
};

util.inherits(EthProxy, EventEmitter);

EthProxy.prototype.connect = function (connection, contractName, contractAddress) {
    if (!this.web3) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(connection));
    }

    if (!this.contract) {
        this.web3.solidityCompiler();
        this.contractName = contractName;
        console.log(process.env.PWD + "/.ethereum_contracts");
        this.contract = this.web3.instanceAt(contractName, contractAddress);
    }
};

//TODO(xiaolu) finish later
EthProxy.prototype.startWatchBlock = function () {
    //
    // this.web3.eth.filter("latest", function(error, result){
    //     console.log("new block comming");
    //     if (error) {
    //         console.log('>>>>>>>>>');
    //         console.log(error);
    //     } else {
    //         var block = self.web3.eth.getBlock(blockHash, false);
    //         for(var i=0; i<block.transactions.length; i++) {
    //             var txHash=block.transactions[i];
    //             // var txwait = self.tx_wait[txHash];
    //             // console.log("transaction watched found", txHash, "waiting",txwait.canonicalAfter,"block(s)");
    //             var receipt=self.web3.eth.getTransactionReceipt(txHash);
    //
    //
    //         }
    //
    //     }
    // });
};

EthProxy.prototype.startWatchEvent = function (lastBlockNumber) {
    var _web3 = this.web3;
    var newestBlockNumber = _web3.eth.blockNumber;
    if (newestBlockNumber > lastBlockNumber) {
        var orderFilledEventName = this.contractName + "." + consts.LoopringProtocolEventType.ORDER_FILLED;
        var es = _web3.eventSynchronizer([orderFilledEventName]);
        es.historyFromBlock(lastBlockNumber, function(error, log) {
            _web3.completeLog(log); // optional: additional function to complete the content of the log message (see below)
            newEventHandler(error, log);
            console.log("Log:",log);
        });
    }

    // es.startWatching(function(error, log) {
    //     newEventHandler(error, log);
    // });
};

function newEventHandler(error, event) {
    if (!error) {
        console.log(error);
    } else if (!event) {
        console.log("event is undefined");
    }  else {
        eventHandler(event);
    }
}

function eventHandler(event) {

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
            OrderService.cancelOrder(event, function (data) {
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
};

module.exports.init = function (conn, contractName, contractAddr, lastBlockNumber) {
    var ethProxy = new EthProxy();
    ethProxy.connect(conn, contractName, contractAddr);
    ethProxy.startWatchBlock();
    ethProxy.startWatchEvent(lastBlockNumber);
    module.exports.EthProxy = ethProxy;
};
