const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const app = express.Router();
const multer = require("multer");
var passport = require("passport");
var mongojs = require("mongojs");
var bcrypt = require("bcrypt");
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

app.post("/checkLogin", function (req, res) {
    console.log(req.body);
    Users.findOne({
            email: req.body.email
        },
        function (err, result) {
            console.log(result);
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
                    ob.photoloc = result.photoloc;
                    ob.gender = result.gender;
                    ob.city = result.city;
                    ob.DOB = result.DOB;
                    ob.phoneno = result.phoneno;
                    ob.type = result.type;
                    req.session.name = result.name;
                    req.session.data = ob;
                    console.log(req.session.data);
                    if (req.session.data.type == "Customer") res.redirect("home");
                    else if (req.session.data.type == "Admin") res.redirect("home");
                    else if ((req.session.data.type = "Seller"))
                        res.redirect("sellerpage");
                } else {
                    console.log("wrong details");
                    res.send("wrong details");
                }
            });
        }
    ).catch(err => {
        console.error(err);
        res.send(error);
    });
});

app.post("/addToCart", function (req, res) {
    console.log(req.body);
    var prod = {
        productdata: req.body._id,
        quantity: req.body.quantity
    };
    Users.findOneAndUpdate({
            _id: req.session._id
        }, {
            $push: {
                cart: prod
            }
        },
        function (error, result) {
            console.log(result);
            if (error) throw error;
            else {}
            res.send("1");
        }
    );
});

app.post("/cleancart", function (req, res) {
    console.log("clean cart");
    Users.updateOne({
        "_id": req.session._id
    }, {
        "cart": []
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
});

app.get("/getCartProduct", function (req, res) {
    console.log(req.body);
    Users.findOne({
        _id: req.session._id
    }).populate('cart.productdata').
    exec(function (err, result) {
        console.log(result);
        if (err) console.log("error");
        else {
            console.log(result.cart);
            res.send(JSON.stringify(result.cart));
        }
    });
});

app.post("/deletefromcart", function (req, res) {
    console.log(req.body);
    Users.updateOne({
        "_id": req.session._id
    }, {
        $pull: {
            "cart": {
                "productdata": req.body._id
            }
        }
    }, function (error, result) {
        if (error)
            throw error;
        else {
            res.send("true");
        }
    })
});

app.post("/buyfromcart", function (req, res) {
    console.log(req.body);


    Users.findOne({
        _id: req.session._id
    }).exec(function (err, result) {
        console.log(result);
        if (err) console.log("error");
        else {
            Users.updateOne({
                "_id": req.session._id
            }, {
                "ordered": result.cart
            }, function (error, result) {
                if (error)
                    throw error;
                else {
                    Users.updateOne({
                        "_id": req.session._id
                    }, {
                        "cart": []
                    }, function (error, result) {
                        if (error)
                            throw error;
                        else {
                            res.send("true");
                        }
                    })
                }
            })
        }
    });
});

app.get("/getOrderedProduct", function (req, res) {
    console.log(req.body);
    console.log(req.body);
    Users.findOne({
        _id: req.session._id
    }).populate('ordered.productdata').
    exec(function (err, result) {
        console.log(result);
        if (err) console.log("error");
        else {
            console.log(result.cart);
            res.send(JSON.stringify(result.ordered));
        }
    });
});

module.exports = app;