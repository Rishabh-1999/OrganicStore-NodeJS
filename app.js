const express = require("express");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var bodyParser = require("body-parser");
const path = require("path");
var favicon = require("serve-favicon");
var mongoose = require("mongoose");
var engine = require('ejs-mate');
var morgan = require("morgan");
var flash = require("express-flash");
require("dotenv").config();
var app = express();
var PORT = process.env.PORT || 3000;

/* DB */
require("./static/db");

app.use(morgan("dev"));

var db = mongoose.connection;

/* Session */
app.use(
  session({
    secret: "abcUCAChitkara",
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: db
    })
  })
);

app.use(favicon(path.join(__dirname, "public//img/", "logo.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

/* Middleware */
var middleware = require("./middleware/middleware");

/* Routing Implementation */
app.use("/user", require("./routes/Users"));
app.use("/products", require("./routes/Products"));

app.get("/", function (req, res) {
  if (req.session.isLogin) {
    req.session.isLogin = 0;
  }
  res.render("login", {
    errors: req.flash('errors'),
    success: req.flash('success')
  });
});

app.get("/register", function (req, res) {
  res.render("register", {
    errors: req.flash('errors')
  });
});

app.get("/home", middleware.checkSession, function (req, res) {
  if (req.session.data.type == "Customer")
    res.render("home", {
      data: req.session.data,
      shownavpro: "true",
      success: req.flash('success'),
      errors: req.flash('errors')
    });
  else if (req.session.data.type == "Seller")
    res.render("sellerpage", {
      data: req.session.data,
      shownavpro: "false",
      success: req.flash('success')
    });
  else if (req.session.data.type == "Admin")
    res.render("adminpage", {
      data: req.session.data,
      shownavpro: "false",
      success: req.flash('success')
    });
});

app.get("/adminpage", middleware.checkSession, middleware.checkAdmin, function (
  req,
  res
) {
  res.render("adminpage", {
    data: req.session.data,
    shownavpro: "false"
  });
});

/* GET seller's Page */
app.get("/sellerpage", middleware.checkSession, middleware.checkSeller, function (req, res) {
  res.render("sellerpage", {
    data: req.session.data,
    shownavpro: "false"
  });
});

app.get(
  "/adminpageUser",
  middleware.checkSession,
  middleware.checkAdmin,
  function (req, res) {
    res.render("adminpageUser", {
      data: req.session.data,
      shownavpro: "false"
    });
  }
);

app.get(
  "/adminpageProduct",
  middleware.checkSession,
  middleware.checkAdmin,
  function (req, res) {
    res.render("adminpageProduct", {
      data: req.session.data,
      shownavpro: "false"
    });
  }
);

app.get(
  "/user/cart",
  middleware.checkSession,
  middleware.checkCustomer,
  function (req, res) {
    res.render("cartpage", {
      data: req.session.data,
      shownavpro: "false",
      success: req.flash('success')
    });
  }
);

app.get("/user/changepasswordpage", middleware.checkSession, function (
  req,
  res
) {
  res.render("changepasswordpage", {
    data: req.session.data,
    shownavpro: "false",
    success: req.flash('success'),
    errors: req.flash('errors')
  });
});

app.get("/logout", middleware.checkSession, function (req, res) {
  req.session.destroy();
  res.render("login");
  console.log("logouted");
});

app.listen(PORT, () => {
  console.log("Sever on port: " +
    PORT);
});