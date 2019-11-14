const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const app = express.Router();
const multer = require("multer");
var passport = require("passport");
var mongojs = require("mongojs");
var dateFormat = require('dateformat');
var bcrypt = require("bcrypt");
var flash = require("express-flash");
const saltRounds = 10;

// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// parse application/json
app.use(bodyParser.json());

var producttable = require("../models/products");
var Users = require("../models/Users");

var middleware = require("../middleware/middleware");

/* POST Check Loign */
app.post("/checkLogin", function (req, res) {
    Users.findOne({
            email: req.body.email
        },
        function (err, result) {
            if (result) {
                bcrypt.compare(req.body.password, result.password, function (
                    err,
                    password
                ) {
                    if (password) {
                        req.session.isLogin = 1;
                        req.session._id = result._id;
                        req.session.name = result.name;
                        req.session.password = req.body.password;

                        var ob = new Object();
                        ob.name = result.name;
                        ob._id = result._id;
                        ob.email = result.email;
                        ob.gender = result.gender;
                        ob.city = result.city;
                        ob.DOB = result.DOB;
                        ob.totalincart = result.totalincart;
                        ob.phoneno = result.phoneno;
                        ob.type = result.type;
                        req.session.name = result.name;
                        req.session.data = ob;
                        console.log("-------------------Logined--------------------")
                        if (req.session.data.type == "Customer") res.redirect('/home');
                        else if (req.session.data.type == "Admin") res.redirect("/adminpage");
                        else if ((req.session.data.type = "Seller"))
                            res.redirect("/products/sellerpage");
                    } else {
                        req.flash('errors', 'Username/Password Incorrect.');
                        return res.redirect('/');
                    }
                });
            } else {
                req.flash('errors', 'Username/Password Incorrect.');
                return res.redirect('/');
            }
        }
    ).catch(err => {
        res.send(error);
    });
});

app.post("/register", function (req, res) {
    Users.findOne({
        email: req.body.email
    }, function (err, result) {
        if (result) {
            req.flash('errors', 'Account with that email address already exists');
            return res.redirect('/register');
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                let us = new Users({
                    "name": req.body.name,
                    "email": req.body.email,
                    "phoneno": req.body.phoneno,
                    "gender": req.body.gender,
                    "DOB": req.body.DOB,
                    "password": hash,
                    "address1": req.body.address1,
                    "address2": req.body.address2,
                    "city": req.body.city,
                    "state": req.body.state,
                    "zipcode": req.body.zipcode,
                    "type": "Customer",
                    "totalincart": 0,
                    "cart": [],
                    "ordered": []
                })
                us.save()
                    .then(data => {
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log(err)
                    })
            });
        }
    })
})

/* POST change password */
app.post("/changepassword", middleware.checkSession, function (req, res) {
    Users.findOne({
        "_id": req.session._id
    }, function (error, result) {
        if (error)
            throw error;
        else {
            if (result == null)
                res.send("0");
            else {
                bcrypt.compare(req.body.oldpass, result.password, function (err, boolans) {
                    if (boolans == true) {
                        bcrypt.hash(req.body.newpass, saltRounds, function (err, newpass) {
                            Users.updateOne({
                                "_id": req.session._id,
                            }, {
                                $set: {
                                    "password": newpass
                                }
                            }, function (error, result) {
                                if (error)
                                    throw error;
                                else {
                                    if (result == null)
                                        req.flash('errors', 'Password failed to Update.');
                                    else
                                        req.flash('success', 'Password Updated.');
                                    return res.redirect('/user/changepasswordpage');
                                }
                            });
                        });
                    } else {
                        req.flash('errors', 'Old Password Incorrect.');
                        return res.redirect('/user/changepasswordpage');
                    }
                });
            }
        }
    });
})

/* POST get User's data for table */
app.post('/getUserTable', middleware.checkSession, function (req, res) {
    let query = {};
    let params = {};

    if (req.body.type != "All")
        query["$and"] = [{
            "type": req.body.type
        }]
    else {
        query["$or"] = [{
            "type": "Customer"
        }, {
            "type": "Seller"
        }]
    }


    if (req.body.search.value) {
        query["$or"] = [{
                "email": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "name": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "phoneno": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "state": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            }
        ]
    }

    let sortingType;
    if (req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if (req.body.order[0].column === '0')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                name: sortingType
            }
        };
    else if (req.body.order[0].column === '2')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                email: sortingType
            }
        };
    else if (req.body.order[0].column === '3')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                state: sortingType
            }
        };

    Users.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            Users.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    Users.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else
                            res.send({
                                "recordsTotal": totalCount,
                                "recordsFiltered": filteredCount,
                                data
                            });
                    })
                }
            });
        }
    });
});

/* POST Add a product to cart */
app.post("/addToCart", function (req, res) {
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
});

/* POST Clean Cart */
app.post("/cleancart", function (req, res) {
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
});

/* POST Update Profile */
app.post("/updateprofile", function (req, res) {
    Users.updateOne({
            "_id": req.session._id
        }, {
            $set: {
                "name": req.body.name,
                "gender": req.body.gender,
                "DOB": req.body.DOB,
                "phoneno": req.body.phoneno,
                "address1": req.body.address1,
                "address2": req.body.address2,
                "city": req.body.city,
                "state": req.body.state,
                "zipcode": req.body.zipcode
            }
        },
        function (error, result) {
            if (error) {
                req.flash('errors', 'Profile failed to update.');
            } else {
                req.flash('success', 'Profile Updated');
            }
            if (req.session.data.type == "Customer")
                return res.redirect('/home');
            else if (req.session.data.type == "Seller")
                return res.redirect('/sellerpage');
            else if (req.session.data.type == "Admin")
                return res.redirect('/adminpage');
        })
});

/* GET get product from user's cart */
app.get("/getCartProduct", function (req, res) {
    Users.findOne({
        _id: req.session._id
    }).populate('cart.productdata').
    exec(function (error, result) {
        if (error) {
            res.send("0");
        } else {
            res.send(JSON.stringify(result.cart));
        }
    });
});

/* POST delete a item from cart */
app.post("/deletefromcart", function (req, res) {
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
});

/* POST delete a User */
app.post("/deleteuser", function (req, res) {
    Users.deleteOne({
        "_id": req.body._id
    }, function (error, result) {
        if (error) {
            res.send("0");
        } else {
            res.send("1");
        }
    })
});

/* POST Buy all items from cart */
app.post("/buyfromcart", function (req, res) {
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
});

/* GET get user's ordered data */
app.get("/ordered", middleware.checkSession, middleware.checkCustomer, function (req, res) {
    res.render("orderedpage", {
        data: req.session.data,
        shownavpro: "false",
        success: req.flash('success')
    });
});

/* GET user's profile with address for change profile page */
app.get("/profile", middleware.checkSession, function (req, res) {
    Users.findOne({
        _id: req.session._id
    }).
    exec(function (err, result) {
        if (err) console.log("error");
        else {
            var add = new Object;
            add.address1 = result.address1;
            add.address2 = result.address2;
            add.state = result.state;
            add.city = result.city;
            add.phoneno = result.phoneno;
            add.DOB = result.DOB;
            add.gender = add.gender;
            add.zipcode = result.zipcode;
            res.render("profile", {
                data: req.session.data,
                shownavpro: "false",
                newdata: add
            });
        }
    });
});

app.get("/addproductpage", middleware.checkSession, middleware.checkSeller, function (req, res) {
    res.render("addproductpage", {
        data: req.session.data,
        shownavpro: "false"
    });
});

/* POST ordered product from user */
app.get("/getOrderedProduct", function (req, res) {
    Users.findOne({
        _id: req.session._id
    }).populate('ordered.productdata').
    exec(function (err, result) {
        if (err) console.log("error");
        else {
            res.send(JSON.stringify(result.ordered));
        }
    });
});

module.exports = app;