var product = require('../models/products');

exports.getSellerProduct = async function (query) {
    try {
        var details = await product.find(query)
        return details;
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}