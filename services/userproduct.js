var Users = require("../models/Users");
var dateFormat = require('dateformat');

exports.getOrderedProduct = async function (query) {
    try {
        return await Users.findOne(query).populate('ordered.productdata');;
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}

exports.getCartProduct = async function (query) {
    try {
        return await Users.findOne(query).populate('cart.productdata');
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}

exports.buyfromcart = async function (query, req, res) {
    Users.findOne({
        _id: req.session.passport.user._id
    }).exec(function (err, result) {
        if (err) console.log("error");
        else {
            var now = new Date();
            for (var i = 0; i < result.cart.length; i++) {
                result.cart[i].date = dateFormat(now, "isoDateTime");
            }
            Users.updateOne({
                "_id": req.session.passport.user._id
            }, {
                $push: {
                    "ordered": result.cart
                }
            }, function (error, result1) {
                if (error)
                    throw error;
                else {
                    Users.updateOne({
                        "_id": req.session.passport.user._id
                    }, {
                        "cart": [],
                        "totalincart": 0
                    }, function (error, result2) {
                        if (error)
                            throw error;
                        else {
                            req.session.passport.user.totalincart = 0;
                            req.flash('success', 'Successfully Ordered From cart');
                            return res.redirect('/user/ordered');
                        }
                    })
                }
            })
        }
    });
}

exports.deletefromcart = async function (query, req, res) {
    Users.updateOne({
        "_id": req.session.passport.user._id
    }, {
        $pull: {
            "cart": {
                "productdata": req.body._id
            }
        },
        $inc: {
            'totalincart': -1
        }
    }, function (error, result) {
        if (error) {
            res.send("0");
        } else {
            req.session.passport.user.totalincart = req.session.passport.user.totalincart - 1;
            res.send("1");
        }
    })
}

exports.cleancart = async function (query, req, res) {
    Users.updateOne({
        "_id": req.session.passport.user._id
    }, {
        "cart": [],
        'totalincart': 0
    }, function (error, result) {
        if (error) {
            res.send("0");
        } else {
            req.session.passport.user.totalincart = 0;
            req.flash('success', 'Successfully Cart Cleaned');
            return res.redirect('/user/cart');
        }
    })
}

exports.addToCart = async function (query, req, res) {
    var now = new Date();
    var prod = {
        productdata: req.body._id,
        quantity: req.body.quantity,
        date: dateFormat(now, "isoDateTime")
    };
    Users.findOneAndUpdate({
            _id: req.session.passport.user._id
        }, {
            $push: {
                cart: prod
            },
            $inc: {
                'totalincart': 1
            }
        },
        function (error, result) {
            if (error) {
                res.send("0");
            } else {
                req.session.passport.user.totalincart = req.session.passport.user.totalincart + 1;
                res.send("1");
            }
        }
    );
}