var mongoose = require("mongoose");

var products = require('./products');
var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var loginSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  type: String,
  cart: [{
    productid: [{
      'type': mongoose.Schema.Types.ObjectId,
      'ref': products
    }],
    quantity: Number
  }],
  ordered: [{
    productid: [{
      'type': mongoose.Schema.Types.ObjectId,
      'ref': products
    }],
    quantity: Number
  }]
});

var logins = mongoose.mo;
var logins = mongoose.model("loginusers", loginSchema);
module.exports = logins;