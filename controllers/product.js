var services = require('../services');

module.exports.getAllFruits = async function (req, res, next) {
    res.send(await services.product.getFruits({
        category: "Fruits"
    }));
}

module.exports.getAllJuice = async function (req, res, next) {
    res.send(await services.product.getJuice({
        category: "Juice"
    }));
}

module.exports.getAllVegetable = async function (req, res, next) {
    res.send(await services.product.getVegetable({
        category: "Vegetable"
    }));
}

exports.deleteproduct = async function (req, res, next) {
    await services.product.deleteproduct({
        "_id": req.body._id
    }, req, res);
}

exports.getSellerProduct = async function (req, res, next) {
    res.send(await services.seller.getSellerProduct({
        sellercompany: req.session.passport.user.name
    }));
}

exports.getProductTable = async function (req, res, next) {
    await services.tabledata.getProductTable({
        sellercompany: req.session.passport.user.name
    }, req, res);
}