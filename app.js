require("./models/db");
const express = require("express");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
const path = require("path");
const exphbs = require("express-handlebars");
var bcrypt = require('bcrypt');
const saltRounds = 10;
var mongoose = require('mongoose');

const bodyparser = require("body-parser");
const orderController = require("./controllers/orderController");

var app = express();
/* Bodyparser */
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

var db = mongoose.connection;
/* Session */
app.use(session({
  secret: "abcUCAChitkara",
  resave: true,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: db
  })
}));

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Required Model */
var producttable = require("./models/products");
var Users = require("./models/Users");
var middleware = require('./middleware/middleware');

/* Routing Implementation */
app.use('/users', require('./routes/Users'));
app.use('/products', require('./routes/Products'));


app.get("/", function (req, res) {
  res.render("login");
});

app.get("/home", function (req, res) {
  res.render("home", {
    data: req.session.data
  });
});

app.get("/sellerpage", middleware.checkSeller, function (req, res) {
  res.render("sellerpage");
});

app.listen(3000, () => {
  console.log("Sever on port: 3000");
});
// app.use('/', orderController);