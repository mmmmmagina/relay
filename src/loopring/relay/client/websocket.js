'use strict'

//TODO not start
var server = require('http').createServer();
var io = require('socket.io')(server);

module.exports.start = function(connection) {

    io.on('connection', function(client){
        client.on('ping', function(data){

        });
        client.on('pong', function(data){

        });
        client.on('disconnect', function(){});
    });
    server.listen(connection);

};
