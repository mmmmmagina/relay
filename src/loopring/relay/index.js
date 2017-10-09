const http = require('http');
var jayson = require('jayson');


const hostname = '127.0.0.1';
const port = 3000;

var methods = {
    add: function(args, callback) {
        callback(null, args[0] + args[1]);
    },
    divse : function (args, callback) {
        callback(null, args[0] - args[1]);
    }
};

var server = jayson.server(methods, {
    router : function (method, params) {
        console.log(method);
        console.log(this._methods);
        console.log(this._methods[method]);
        console.log(typeof(this._methods[method]));
        if (typeof(this._methods[method]) === "function")
            return this._methods[method];
        if (method === 'add_2') {
            var fn = server.getMethod('add').getHandler();
            return new jayson.Method(function (args , done) {
                args.unshift(2);
                fn(args, done);
            })
        }
    }
});

server.http().listen(3000, () => {
    console.log('Server running at 300');
});

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });
