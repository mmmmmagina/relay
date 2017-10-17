'use strict';


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BigNumber = require('bignumber.js');

/**
 * Order Schema
 */

const OrderSchema = new Schema({
    protocol: { type : String, default : '', trim : true },
    owner: { type : String, default : '', trim : true },
    orderHash: { type : String, default : '', trim : true },
    tokenS: { type : String, default : '', trim : true },
    tokenB: { type : String,  trim : true },
    amountS: String,
    amountB: String,
    timestamp: Number,
    ttl  : Number,
    salt  : String,
    lrcFee  : Number,
    buyNoMoreThanAmountB  : Boolean,
    marginSplitPercentage  : Number,
    v  : Number,
    s  : String,
    r  : String
});

/**
 * Validations
 */

// OrderSchema.path('title').required(true, 'Order title cannot be blank');
// OrderSchema.path('body').required(true, 'Order body cannot be blank');

/**
 * Pre-remove hook
 */

OrderSchema.pre('remove', function (next) {
  // const imager = new Imager(imagerConfig, 'S3');
  // const files = this.image.files;

  // if there are files associated with the item, remove from the cloud too
  // imager.remove(files, function (err) {
  //   if (err) return next(err);
  // }, 'article');

  next();
});

//TODO
OrderSchema.pre('cancel', function (next) {
    // verify the input data
    next();
});

/**
 * Methods
 */

OrderSchema.methods = {

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @api private
   */

  //TODO query by orderHash
  update: function (state, amountS, amountB) {

  }

  // addComment: function (user, comment) {
  //   this.comments.push({
  //     body: comment.body,
  //     user: user._id
  //   });
  //
  //   if (!this.user.email) this.user.email = 'email@product.com';
  //
  //   notify.comment({
  //     article: this,
  //     currentUser: user,
  //     comment: comment.body
  //   });
  //
  //   return this.save();
  // },
  //
  // /**
  //  * Remove comment
  //  *
  //  * @param {commentId} String
  //  * @api private
  //  */
  //
  // removeComment: function (commentId) {
  //   const index = this.comments
  //     .map(comment => comment.id)
  //     .indexOf(commentId);
  //
  //   if (~index) this.comments.splice(index, 1);
  //   else throw new Error('Comment not found');
  //   return this.save();
  // }
};

/**
 * Statics
 */

OrderSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function (_id) {
    return this.findOne({ _id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec();
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */

  list: function (options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .populate('user', 'name username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

var ipfsConvertSet = ['timestamp', 'ttl', 'lrcFee'];

module.exports.toIpfsMsg = (order) => {
    ipfsConvertSet.forEach(k => {
        if (k == 'lrcFee') {
            var lrcFeeBig = new BigNumber(order[k]);
            order[k] = "0x" + lrcFeeBig.mul(10e18).toString(16);
            console.log("0x" + lrcFeeBig.mul(10e18).toString(16));
            console.log(order[k]);
        } else {
            order[k] = "0x" + order[k].toString(16);
        }
    })
}

module.exports.fromIpfsMsg = (order) => {
    ipfsConvertSet.forEach(k => {
        if (k == 'lrcFee') {
            var lrcFeeBig = new BigNumber(order[k]);
            order[k] = lrcFeeBig.div(10e18).toNumber();
        } else {
            order[k] = parseInt(order[k]);
        }
})
}

mongoose.model('Order', OrderSchema);
module.exports.OrderSchema = OrderSchema;
