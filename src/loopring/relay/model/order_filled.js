'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Order Filled Schema
 */

const OrderFilledSchema = new Schema({
    _ringIndex: String,
    _time: String,
    _blocknumber: String,
    _ringhash: String,
    _prevOrderHash: String,
    _orderHash: String,
    _nextOrderHash: String,
    _amountS: String,
    _amountB  : String,
    _lrcReward  : String,
    _lrcFee  : String
});

/**
 * Validations
 */

// OrderFilledSchema.path('title').required(true, 'Order title cannot be blank');
// OrderFilledSchema.path('body').required(true, 'Order body cannot be blank');

/**
 * Pre-remove hook
 */

OrderFilledSchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'article');

  next();
});

//TODO
OrderFilledSchema.pre('cancel', function (next) {
    // verify the input data
    next();
});

/**
 * Methods
 */

OrderFilledSchema.methods = {};

/**
 * Statics
 */

OrderFilledSchema.statics = {};

module.exports = mongoose.model('OrderFilled', OrderFilledSchema);
module.exports.OrderFilledSchema = OrderFilledSchema;
