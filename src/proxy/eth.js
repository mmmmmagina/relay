'use strict';

var Web3 = require('web3');
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
    this.contract = null;
    this.redisProxy = redisProxy;
};

util.inherits(EthProxy, EventEmitter);

EthProxy.prototype.connect = function (connection) {
    if (!this.web3) {
        this.web3 = new Web3(new Web3.providers.HttpProvider(connection));
    }
    //TODO abi is a string to config later.
    var abi = process.env.LOOPRING_PROTOCOL_ABI;
    if (!this.contract) {
        this.contract = this.web3.eth.contract(JSON.parse(abi));
        this.sigContractInstance =  this.contract.at('0xksdfjsdfjk')
    }
};

EthProxy.prototype.startWatchBlock = function () {

    var blocks = new EthereumBlocks({web3 : this.web3});
    blocks.registerHandler('myHandler', (eventType, blockId, data) => {
        switch (eventType) {
        case 'block':
            /* data = result of web3.eth.getBlock(blockId) */
            console.log('Block id', blockId);
            console.log('Block nonce', data.nonce);
            break;
        case 'error':
            /* data = Error instance */
            console.error(data);
            break;
        }
    });
    blocks.start().catch(console.error);

    var filter = this.web3.eth.filter("latest");
  filter.watch(function (err, rst) {
      console.log("new block comming");
      if (err) {
          console.log('>>>>>>>>>');
          console.log(err);
      } else {
          console.log(rst);
      }
  })
};

EthProxy.prototype.startWatchEvent = function() {
    var events = this.sigContractInstance.allEvents();
    events.watch(function(error, event){
        if (!error)
            console.log(event);

        if (!event) {
           console.log("event is undefined");
           return;
        }

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
    });
};

module.exports.init = function (conn) {
    var ethProxy = new EthProxy();
    ethProxy.connect(conn);
    ethProxy.startWatchBlock();
    ethProxy.startWatchEvent();
    module.exports.EthProxy = ethProxy;
};
