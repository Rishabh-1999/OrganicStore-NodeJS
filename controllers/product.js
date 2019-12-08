var services = require('../services');

module.exports.getAllFruits = async function (req, res, next) {
    var details = await services.product.getFruits({
        category: "Fruits"
    })
    res.send(details);
}

module.exports.getAllJuice = async function (req, res, next) {
    var details = await services.product.getJuice({
        category: "Juice"
    })
    res.send(details);
}

module.exports.getAllVegetable = async function (req, res, next) {
    var details = await services.product.getVegetable({
        category: "Vegetable"
    })
    res.send(details);
}

exports.deleteproduct = async function (req, res, next) {
    var details = await services.product.deleteproduct({
        "_id": req.body._id
    }, req, res);
}

exports.getSellerProduct = async function (req, res, next) {
    var details = await services.seller.getSellerProduct({
        sellercompany: req.session.name
    });
    res.send(details);
}

exports.getProductTable = async function (req, res, next) {
    var details = await services.tabledata.getProductTable({
        sellercompany: req.session.name
    }, req, res);
}