const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: String,
        required: true
    },
    imgloc: {
        type: String,
        required: true,
        trim: true
    },
    sellercompany: {
        type: String,
        required: true,
        trim: true
    }
})

var products = mongoose.model('products', productSchema);
module.exports = products;