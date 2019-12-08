const express = require("express");
var bodyParser = require("body-parser");
const app = express.Router();

// parse application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

// parse application/json
app.use(bodyParser.json());

// Models
var producttable = require("../models/products");
var Users = require("../models/Users");

// Middleware
var middleware = require("../middleware/middleware");

// Controllers
var controllers = require('../controllers');

/* POST Check Login */
app.post("/checkLogin", controllers.users.checkLogin);

app.post("/register", controllers.users.register);

/* POST change password */
app.post("/changepassword", middleware.checkSession, controllers.users.changepassword);

/* POST get User's data for table */
app.post('/getUserTable', middleware.checkSession, controllers.users.getUserTable);

/* POST Add a product to cart */
app.post("/addToCart", middleware.checkSession, controllers.userproduct.addToCart);

/* POST Clean Cart */
app.post("/cleancart", middleware.checkSession, controllers.userproduct.cleancart);

/* POST Update Profile */
app.post("/updateprofile", middleware.checkSession, controllers.users.updateProfile);

/* GET get product from user's cart */
app.get("/getCartProduct", middleware.checkSession, controllers.userproduct.getCartProduct);

/* POST delete a item from cart */
app.post("/deletefromcart", middleware.checkSession, controllers.userproduct.deletefromcart);

/* POST delete a User */
app.post("/deleteuser", controllers.users.deleteuser);

/* POST Buy all items from cart */
app.post("/buyfromcart", middleware.checkSession, controllers.userproduct.buyfromcart);

/* GET get user's ordered data */
app.get("/ordered", middleware.checkSession, middleware.checkCustomer, function (req, res) {
    res.render("orderedpage", {
        data: req.session.data,
        shownavpro: "false",
        success: req.flash('success')
    });
});

/* GET user's profile with address for change profile page */
app.get("/profile", middleware.checkSession, controllers.users.getProfile);

app.get("/addproductpage", middleware.checkSession, middleware.checkSeller, function (req, res) {
    res.render("addproductpage", {
        data: req.session.data,
        shownavpro: "false"
    });
});

/* POST ordered product from user */
app.get("/getOrderedProduct", middleware.checkSession, controllers.userproduct.getOrderedProduct);

module.exports = app;