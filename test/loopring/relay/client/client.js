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

client.request('eth_sendRawTransaction', ['0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675'], function(err, response) {
    if(err) throw err;
    console.log(response); // 5!
});

// client.request('eth_getBlock', [30], function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });

// client.request('eth_getBalance', ['0x407d73d8a49eeb85d32cf465507dd71d507100c1'], function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });

// var submitOrderRequest = {
//     "protocol" : "0xfd9ecf92e3684451c2502cf9cdc45962a4febffa",
//     "owner" : "0xfd9ecf92e3684451c2502cf9cdc45962a4febffa",
//     "tokenS" : "0x39948535983958",
//     "tokenB" : "0x2348348199123",
//     "amountS" : "0x23423",
//     "amountB" : "0x2934ab9",
//     "timestamp" : 1406014710,
//     "ttl": 1200,
//     "salt" : '0x2349',
//     "lrcFee" : 20,
//     "buyNoMoreThanAmountB" : true,
//     "marginSplitPercentage" : 50, // 0~100
//     "v" : 112,
//     "r" : "239dskjfsn23ck34323434md93jchek3",
//     "s" : "dsfsdf234ccvcbdsfsdf23438cjdkldy"
// };
// client.request('loopring_submitOrder', submitOrderRequest, function(err, response) {
//     if(err) throw err;
//     console.log(response); // 5!
// });