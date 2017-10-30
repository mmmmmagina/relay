'use strict';

var consts = require('../constants/const');
var io = require('socket.io')();
var logger = require('../log/logger').defaultLogger;
var redis = require('../proxy/redis-proxy');
var WebSocket = require('ws');
var util = require('../util/util');

module.exports.start = function(port) {

    const wss = new WebSocket.Server({ port: port });

    //TODO(xiaolu) broadcast to all client each time, has to recording which client require what
    //TODO(xiaolu) we will think about this later. now each client add a setInterval method
    // var clientMap = function () {
    //     var tokens = process.env.SUPPORT_TOKENS;
    //     var markets = tokens.filter(function (t) {
    //        return t.toLowerCase() !== 'eth';
    //     }).map(function (t) {
    //         return t + "-eth";
    //     });
    //
    //     var result = {};
    //     result['depth'] = {};
    //     result['candle'] = {};
    //     markets.forEach(function (m) {
    //         result['depth'][m] = [];
    //         result['candle'][m] = [];
    //     });
    //     return result;
    // }();

    var redisProxy = redis.RedisProxy;

    wss.on('connection', function connection(ws) {

        logger.info("client connected ");

        var intervalObj = null;

        ws.on('message', function incoming(data) {
            var {id, sub} = JSON.parse(data);

            if (!id) {
                ws.send(wrapped(id, "id must be applied", null));
                return;
            }

            if (typeof sub !== 'string' || sub.split('.').length!== 4) {
                ws.send(wrapped(id, "subscribe type is not correct", null))
                return;
            }

            var subType = sub.split('.')[1];
            var market = util.generateTokenPair(sub.split('.')[2] + "-" + sub.split('.')[3]);

            if ('depth' === subType) {
                // clientMap[subType][market].push(ws);
                redisProxy.getDepth(market, -1, function (err, resp) {
                    ws.send(wrapped(id, err, resp));
                });

                intervalObj = setInterval(function () {
                    redisProxy.getDepth(market, -1, function (err, resp) {
                        ws.send(wrapped(id, err, resp));
                    });
                }, 5000);

            } else if ('candle' === subType) {
                // clientMap[subType][market].push(ws);
                redisProxy.getCandleTicks(market, -1, function (err, resp) {
                    ws.send(wrapped(id, err, resp));
                });
                intervalObj = setInterval(function () {
                    redisProxy.getCandleTicks(market, -1, function (err, resp) {
                        ws.send(wrapped(id, err, resp));
                    });
                }, 5000);

            } else {
                ws.send(wrapped(id, "unlegal message format", null))
            }
        });
        
        ws.on('close', function () {
            clearInterval(intervalObj);
            console.log('client close');
        })

    });

    // setInterval(function broadcast(data) {
    //     console.log("start broadcast xxxxx");
    //     wss.clients.forEach(function each(client) {
    //         if (client.readyState === WebSocket.OPEN) {
    //             console.log(client);
    //         }
    //     });
    // }, 5000);

};

function wrapped(id, err, response) {
    if (err) {
        return JSON.stringify({id : id, message : err});
    } else {
        return JSON.stringify({id : id, result : response});
    }
}
