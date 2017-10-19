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

var submitOrderRequest = {"protocol":"0xfd9ecf92e3684451c2502cf9cdc45962a4febffa","tokenS":"0x96124db0972e3522a9b3910578b3f2e1a50159c7","tokenB":"0x0c0b638ffccb4bdc4c0d0d5fef062fc512c92512","amountS":"0x2e90edd000","amountB":"0x3b9aca00","timestamp":"0x59e473e4","ttl":"0x2710","salt":"0x03e8","lrcFee":"0x64","buyNoMoreThanAmountB":false,"marginSplitPercentage":0,"v":27,"r":"0xf6c303d0fc892385a038fdbffb80812224b7ac809574effadc136d81e096917a","s":"0x6cd5e0724bccf1f0cb9cc388a4bd0b31e89088c0ca82904e4ddc1147505bf25f","owner":"0x48ff2269e58a373120ffdbbdee3fbcea854ac30a","hash":"0x8d5c7b1e2a064095b72993ca1e8340cb2e0bc9f05f836595812a7dfdd557ca35"}
client.request('loopring_submitOrder', submitOrderRequest, function(err, response) {
    if(err) throw err;
    console.log(response); // 5!
});