var product = require('../models/products');

exports.getSellerProduct = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw new Error('Error while getting Vegetable Details of Seller')
    }
}