const express = require("express");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var bodyParser = require("body-parser");
const path = require("path");
var favicon = require("serve-favicon");
var mongoose = require("mongoose");
var engine = require("ejs-mate");
var morgan = require("morgan");
var flash = require("express-flash");
const passport = require("passport");

require("dotenv").config();

var app = express();

// Passport Config
require("./config/passport")(passport);

var http = require("http");
var server = http.Server(app);
var PORT = process.env.PORT || 3000;

/* DB */
require("./config/db");

app.use(morgan("dev"));

/* Session */
app.use(
  require("express-session")({
    secret: "abcUCAChitkara",
    saveUninitialized: true,
    resave: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    }),
    cookie: {
      secure: false
    }
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(favicon(path.join(__dirname, "public//img/", "logo.ico")));
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());

/* Middleware */
var middleware = require("./middleware/middleware");

/* Routing Implementation */
app.use("/user", require("./routes/Users"));
app.use("/products", require("./routes/Products"));

app.get("/", function (req, res) {
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.render("login", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
});

app.get("/register", function (req, res) {
  res.render("register", {
    errors: req.flash("errors")
  });
});

app.get("/home", middleware.checkSession, function (req, res) {
  //console.log(req.session)
  if (req.session.passport.user.type == "Customer")
    res.render("home", {
      data: req.session.passport.user,
      shownavpro: "true",
      success: req.flash("success"),
      errors: req.flash("errors")
    });
  else if (req.session.passport.user.type == "Seller")
    res.render("sellerpage", {
      data: req.session.passport.user,
      shownavpro: "false",
      success: req.flash("success")
    });
  else if (req.session.passport.user.type == "Admin")
    res.render("adminpage", {
      data: req.session.passport.user,
      shownavpro: "false",
      success: req.flash("success")
    });
});

app.get("/adminpage", middleware.checkSession, middleware.checkAdmin, function (
  req,
  res
) {
  res.render("adminpage", {
    data: req.session.passport.user,
    shownavpro: "false"
  });
});

/* GET seller's Page */
app.get(
  "/sellerpage",
  middleware.checkSession,
  middleware.checkSeller,
  function (req, res) {
    res.render("sellerpage", {
      data: req.session.passport.user,
      shownavpro: "false"
    });
  }
);

app.get(
  "/adminpageUser",
  middleware.checkSession,
  middleware.checkAdmin,
  function (req, res) {
    res.render("adminpageUser", {
      data: req.session.passport.user,
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
      data: req.session.passport.user,
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
      data: req.session.passport.user,
      shownavpro: "false",
      success: req.flash("success")
    });
  }
);

app.get("/user/changepasswordpage", middleware.checkSession, function (
  req,
  res
) {
  res.render("changepasswordpage", {
    data: req.session.passport.user,
    shownavpro: "false",
    success: req.flash("success"),
    errors: req.flash("errors")
  });
});

app.get("/logout", middleware.checkSession, function (req, res) {
  req.session.destroy();
  res.render("login");
  console.log("logouted");
});

server.listen(PORT, () => {
  console.log("Sever on port: " + PORT);
});