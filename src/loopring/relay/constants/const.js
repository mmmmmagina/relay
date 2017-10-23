'use strict';

module.exports.OrderStatus = {
    PENDING : "Pending",
    PARTIALLY_EXECUTED : "PartiallyExecuted",
    FULLY_EXECUTED : "FullyExecuted",
    CANCELLED : "Cancelled"
};

module.exports.WebsocketMsgType = {
    SUBSCRIBE_DEPTH : "subscribeDepth",
    SUBSCRIBE_CANDLE_TICK : "subscribeCandleTick"
};

