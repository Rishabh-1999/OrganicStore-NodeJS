const express = require("express");
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
var bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");
var favicon = require('serve-favicon');
var mongoose = require('mongoose');
const bodyparser = require("body-parser");
var morgan = require('morgan')

var bcrypt = require('bcrypt');
const saltRounds = 10;

var app = express();

/* DB */
require("./models/db");

/* Bodyparser */
app.use(express.urlencoded({
  extended: true
}));

app.use(morgan('dev'));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


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
app.use(favicon(path.join(__dirname, 'public//img/', 'logo.ico')));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* Required Model */
var producttable = require("./models/products");
var Users = require("./models/Users");
var middleware = require('./middleware/middleware');

/* Routing Implementation */
app.use('/user', require('./routes/Users'));
app.use('/products', require('./routes/Products'));

app.get("/", function (req, res) {
  req.session.destroy();
  res.render("login");
});

app.get("/home", middleware.checkSession, function (req, res) {
  if (req.session.data.type == "Customer")
    res.render("home", {
      data: req.session.data,
      shownavpro: "true"
    });
  else if (req.session.data.type == "Seller")
    res.render("sellerpage", {
      data: req.session.data,
      shownavpro: "false"
    });
  else if (req.session.data.type == "Admin")
    res.render("adminpage", {
      data: req.session.data,
      shownavpro: "false"
    });
});

app.get("/adminpage", middleware.checkSession, middleware.checkAdmin, function (req, res) {
  res.render("adminpage", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get("/adminpageUser", middleware.checkSession, middleware.checkAdmin, function (req, res) {
  res.render("adminpageUser", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get("/adminpageProduct", middleware.checkSession, middleware.checkAdmin, function (req, res) {
  res.render("adminpageProduct", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get("/user/cart", middleware.checkSession, middleware.checkCustomer, function (req, res) {
  res.render("cartpage", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get("/user/changepasswordpage", middleware.checkSession, function (req, res) {
  res.render("changepasswordpage", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get('/logout', middleware.checkSession, function (req, res) {
  req.session.destroy();
  res.render('login')
  console.log('logouted');
})

app.listen(3000, () => {
  console.log("Sever on port: 3000");
});