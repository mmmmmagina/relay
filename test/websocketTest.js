const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:3008');

ws.on('open', function open() {
    ws.send('{"id" : 123, "sub": "market.depth.eth.lrc"}');
});

ws.on('message', function incoming(data) {
    console.log(data);
});
