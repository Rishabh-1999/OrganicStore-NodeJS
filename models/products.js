var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    category: String,
    name: String,
    price: String,
    imgloc: String
})

var products = mongoose.model('products', productSchema);
module.exports = products;