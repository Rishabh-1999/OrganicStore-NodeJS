var mongoose = require("mongoose");
var products = require('./products');

var Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: false,
    trim: true
  },
  gender: {
    type: String,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  DOB: {
    type: String,
    required: true,
    trim: true
  },
  phoneno: {
    type: String,
    trim: true
  },
  address1: {
    type: String,
    trim: true
  },
  address2: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  zipcode: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  totalincart: Number,
  cart: [{
    productdata: {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': products
    },
    date: {
      type: String,
      trim: true,
      default: ''
    },
    quantity: Number
  }],
  ordered: [{
    productdata: {
      'type': mongoose.Schema.Types.ObjectId,
      'ref': products
    },
    date: {
      type: String,
      trim: true,
      default: ''
    },
    quantity: Number
  }]
});

var logins = mongoose.model("loginusers", loginSchema);
module.exports = logins;