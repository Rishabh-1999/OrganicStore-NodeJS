const services = require('../services');

module.exports.getOrderedProduct = async function (req, res, next) {
    var details = await services.userproduct.getOrderedProduct({
        "_id": req.session.passport.user._id
    });
    res.send(details.ordered);
}

module.exports.getCartProduct = async function (req, res, next) {
    var details = await services.userproduct.getCartProduct({
        "_id": req.session.passport.user._id
    });
    res.send(details.cart);
}

module.exports.buyfromcart = async function (req, res) {
    await services.userproduct.buyfromcart({
        "_id": req.session.passport.user._id
    }, req, res);
}

module.exports.deletefromcart = async function (req, res, next) {
    await services.userproduct.deletefromcart({
        "_id": req.session.passport.user._id
    }, req, res);
}

module.exports.cleancart = async function (req, res, next) {
    await services.userproduct.cleancart({
        "_id": req.session.passport.user._id
    }, req, res);
}

module.exports.addToCart = async function (req, res, next) {
    await services.userproduct.addToCart({
        "_id": req.session.passport.user._id
    }, req, res);
}