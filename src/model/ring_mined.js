'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Ring Mined Schema
 */

const RingMinedSchema = new Schema({
    _ringIndex: String,
    _time: String,
    _blocknumber: String,
    _ringhash: String,
    _miner: String,
    _feeRecepient: String,
    _ringhashFound: Boolean
});

/**
 * Validations
 */

// RingMinedSchema.path('title').required(true, 'Ring title cannot be blank');
// RingMinedSchema.path('body').required(true, 'Ring body cannot be blank');

/**
 * Pre-remove hook
 */

RingMinedSchema.pre('remove', function (next) {
    // const imager = new Imager(imagerConfig, 'S3');
    // const files = this.image.files;

    // if there are files associated with the item, remove from the cloud too
    // imager.remove(files, function (err) {
    //   if (err) return next(err);
    // }, 'article');

    next();
});

//TODO
RingMinedSchema.pre('cancel', function (next) {
    // verify the input data
    next();
});

/**
 * Methods
 */

RingMinedSchema.methods = {};

/**
 * Statics
 */

RingMinedSchema.statics = {};

module.exports = mongoose.model('RingMined', RingMinedSchema);
