'use strict';

var consts = require('../constants/const');
//TODO not start
var io = require('socket.io')();

module.exports.start = function(connection) {

    io.on('connection', function(client){
        client.on(consts.WebsocketMsgType.SUBSCRIBE_DEPTH, function(data){
            var {s, b} = data.tokenPair;
            var id  = data.id;

        });

        client.on('disconnect', function(){

        });

        io.emit(consts.WebsocketMsgType.SUBSCRIBE_DEPTH, '{"a" : 1}');

        setInterval(function(){
            client.emit('news_by_server', 'Cow goes moo');
        }, 1000);
    });

    io.listen(connection);

};
