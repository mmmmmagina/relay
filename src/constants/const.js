'use strict';

module.exports.OrderStatus = {
    PENDING : "Pending",
    PARTIALLY_EXECUTED : "PartiallyExecuted",
    FULLY_EXECUTED : "FullyExecuted",
    CANCELLED : "Cancelled",
    EXPIRED : "Expired"
};

module.exports.WebsocketMsgType = {
    SUBSCRIBE_DEPTH : "subscribeDepth",
    RESPONSE_DEPTH : "responseDepth",
    SUBSCRIBE_CANDLE_TICKER : "subscribeCandleTicker",
    RESPONSE_CANDLE_TICKER : "responseCandleTicker"
};

module.exports.LoopringProtocolEventType = {
    RING_MINED : "RingMined",
    ORDER_FILLED : "OrderFilled",
    ORDER_CANCELLED : "OrderCancelled",
    CUTOFF_TIMESTAMP_CHANGED : "CutoffTimestampChanged"
};

module.exports.RelayEventType = {
    SUBMIT_ORDER : "SubmitOrder",
    CANCEL_ORDER : "CancelOrder"
};

module.exports.Errors = {
    CANCEL_ORDER_CANCELLED : {code : 6000001, message : ""}
};


