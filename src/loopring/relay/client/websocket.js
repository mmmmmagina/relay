'use strict'

var server = require('http').createServer();
var io = require('socket.io')(server);

module.exports.start = function(connection) {

    io.on('connection', function(client){
        client.on('event', function(data){});
        client.on('disconnect', function(){});
    });
    server.listen(connection);

};
