'use strict';

var Validator = function () {
};

Validator.prototype.isValidOrder = function (order, callback) {
    // if true callback null
    // else callback("error msg");
    callback(null);
};

module.exports = new Validator();