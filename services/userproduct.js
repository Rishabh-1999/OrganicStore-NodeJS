var Users = require("../models/Users");
var dateFormat = require('dateformat');

exports.getOrderedProduct = async function (query) {
    try {
        var details = await Users.findOne(query).populate('ordered.productdata');
        return details;
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}

exports.getCartProduct = async function (query) {
    try {
        var d = await Users.findOne(query).populate('cart.productdata');
        return d;
    } catch (e) {
        throw Error('Error get Vegetable Details')
    }
}

exports.buyfromcart = async function (query, req, res) {
    Users.findOne({
        _id: req.session._id
    }).exec(function (err, result) {
        if (err) console.log("error");
        else {
            var now = new Date();
            for (var i = 0; i < result.cart.length; i++) {
                result.cart[i].date = dateFormat(now, "isoDateTime");
            }
            Users.updateOne({
                "_id": req.session._id
            }, {
                $push: {
                    "ordered": result.cart
                }
            }, function (error, result1) {
                if (error)
                    throw error;
                else {
                    Users.updateOne({
                        "_id": req.session._id
                    }, {
                        "cart": [],
                        "totalincart": 0
                    }, function (error, result2) {
                        if (error)
                            throw error;
                        else {
                            req.session.data.totalincart = 0;
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
        "_id": req.session._id
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
            req.session.data.totalincart = req.session.data.totalincart - 1;
            res.send("1");
        }
    })
}

exports.cleancart = async function (query, req, res) {
    Users.updateOne({
        "_id": req.session._id
    }, {
        "cart": [],
        'totalincart': 0
    }, function (error, result) {
        if (error) {
            res.send("0");
        } else {
            req.session.data.totalincart = 0;
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
            _id: req.session._id
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
                req.session.data.totalincart = req.session.data.totalincart + 1;
                res.send("1");
            }
        }
    );
}