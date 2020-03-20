var product = require('../models/products');

exports.getSellerProduct = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}