'use strict';

var consts = require('../constants/const');
//TODO not start
var io = require('socket.io')();

module.exports.init = function(connection) {

    io.on('connection', function(client){
        client.on(consts.WebsocketMsgType.SUBSCRIBE_DEPTH, function(data){
            var {s, b} = data.tokenPair;
            var id  = data.id;
            redisProxy.getDepth(s, b, function (data) {
                data.id = id;
                client.emit(consts.WebsocketMsgType.RESPONSE_DEPTH, data);
            });
        });

        client.on(consts.WebsocketMsgType.SUBSCRIBE_CANDLE_TICKER, function(data){
            var {s, b} = data.tokenPair;
            var id  = data.id;
            redisProxy.getCandleTicker(s, b, function (data) {
                data.id = id;
                client.emit(consts.WebsocketMsgType.RESPONSE_CANDLE_TICKER, data);
            });
        });

        client.on('disconnect', function(){
        });
    });

    io.listen(connection);

};
