var jayson = require('jayson');
var program = require('commander');

// create a client
var client = jayson.client.http({
    port: 3000
});

// invoke "add_2"
// program.parse(process.argv);
// if (program.args.length == 1 && program.args[0] && program.args[0].length > 7) {
//     for (var i = 0; i < configs.length; i++) {
//         configs[i].cryptoConfig.walletPassPhrase = program.args[0];
//     }
// } else {
//     console.log("Password isn't correct!");
//     console.log("node index.js [password]");
// }

// client.request('eth_sendRawTransaction', ['0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'], function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });

// client.request('eth_getBlock', [30], function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });

// client.request('eth_getBalance', ['0x407d73d8a49eeb85d32cf465507dd71d507100c1'], function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });

var submitOrderRequest = {
    "address" : "0x847983c3a34afa192cfee860698584c030f4c9db1",
    "tokenS" : "Eth",
    "tokenB" : "Lrc",
    "amountS" : 100.3,
    "amountB" : 3838435,
    "timestamp" : 1406014710,
    "ttl": 1200,
    "salt" : 3848348,
    "lrcFee" : 20,
    "buyNoMoreThanAmountB" : true,
    "savingSharePercentage" : 50, // 0~100
    "v" : 112,
    "r" : "239dskjfsn23ck34323434md93jchek3",
    "s" : "dsfsdf234ccvcbdsfsdf23438cjdkldy"
};
client.request('loopring_submitOrder', submitOrderRequest, function(err, response) {
    if(err) throw err;
    console.log(response); // 5!
});