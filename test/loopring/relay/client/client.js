var jayson = require('jayson');
 
// create a client
var client = jayson.client.http({
  port: 3000
});
 
// invoke "add"
client.request('divse', [1, 10], function(err, response) {
  if(err) throw err;
  console.log(response); // 2
});

