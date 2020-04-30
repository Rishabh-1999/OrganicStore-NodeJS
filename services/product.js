var product = require('../models/products');

exports.getFruits = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw new Error('Error while Getting All Fruit Details')
    }
}

exports.getJuice = async function (query) {
    try {
        return await product.find(query)
    } catch (e) {
        throw new Error('Error while Getting All Juice Details')
    }
}

exports.getVegetable = async function (query) {
    try {
        return await product.find(query);
    } catch (e) {
        throw new Error('Error while Getting All Vegetable Details')
    }
}

exports.deleteproductByAdmin = async function (query, req, res) {
    product.deleteOne(query, function (error, result) {
        if (error) {
            throw new Error('Error while Deleting Product by Admin')
            res.send("0");
        } else
            res.send("1");
    })
}

exports.deleteproductByOwner = async function (query, req, res) {
    product.deleteOne(query, function (error, result) {
        if (error) {
            throw new Error('Error while Deleting Product by Owner')
            res.send("0");
        } else
            res.send("1");
    })
}