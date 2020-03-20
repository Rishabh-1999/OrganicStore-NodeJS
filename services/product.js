var product = require('../models/products');

exports.getFruits = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw Error('Error get Fruit Details')
    }
}

exports.getJuice = async function (query) {
    try {
        return await product.find(query)
    } catch (e) {
        throw Error('Error get Juice Details')
    }
}

exports.getVegetable = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}

exports.deleteproduct = async function (query, req, res) {
    product.deleteOne(query, function (error, result) {
        if (error) {
            res.send("0");
        } else
            res.send("1");
    })
}