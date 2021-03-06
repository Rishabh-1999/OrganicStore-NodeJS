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

/* ENV */
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

var app = express();

/* DB */
require("./config/db");

/* Passport Config */
require("./config/passport")(passport);

var http = require("http");
var server = http.Server(app);
var PORT = process.env.PORT || 3000;

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

/* Models */
var Product = require("./models/products")

app.get("/", function (req, res) {
  var err_msg = req.flash("errors")[0]
  if (req.isAuthenticated()) {
    req.logout();
  }
  res.render("login", {
    title: "Login",
    errors: err_msg == undefined ? [] : err_msg,
    success: req.flash("success")
  });
});

app.get("/register", function (req, res) {
  res.render("register", {
    title: "Register",
    errors: req.flash("errors")
  });
});

app.get("/home", middleware.checkSession, function (req, res, next) {
  if (req.session.passport.user.type == "Customer")
    res.render("home", {
      data: req.session.passport.user,
      shownavpro: "true",
      title: "Home",
      success: req.flash("success"),
      errors: req.flash("errors")
    });
  else if (req.session.passport.user.type == "Seller")
    Product.find({
      sellercompany: req.session.passport.user.name
    }).then(result => {
      res.render("sellerpage", {
        data: req.session.passport.user,
        shownavpro: "false",
        title: "Home",
        sellerdata: result,
        success: req.flash("success")
      })
    }).catch(err => {
      err.message = new Error('Error while fetching Seller Product Detail\'s for Seller Page');
      err.status = 404;
      return next(err);
    })
  else if (req.session.passport.user.type == "Admin")
    res.render("adminpage", {
      data: req.session.passport.user,
      shownavpro: "false",
      title: "Home",
      success: req.flash("success")
    });
});

app.get("/adminpage", middleware.checkSession, middleware.checkAdmin, function (req, res) {
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
    Product.find({
      sellercompany: req.session.passport.user.name
    }).then(result => {
      res.render("sellerpage", {
        data: req.session.passport.user,
        shownavpro: "false",
        title: "Home",
        sellerdata: result,
        success: req.flash("success")
      })
    }).catch(err => {
      throw new Error('Error while fetching Seller Data for Seller Page')
    })
  }
);

app.get(
  "/adminpageUser",
  middleware.checkSession,
  middleware.checkAdmin,
  function (req, res) {
    res.render("adminpageUser", {
      data: req.session.passport.user,
      shownavpro: "false",
      title: "User Data Page"
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
      title: "Product Data Page",
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
      title: "Cart Page",
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
    title: "Change Password",
    success: req.flash("success"),
    errors: req.flash("errors")
  });
});

app.get("/logout", middleware.checkSession, function (req, res) {
  req.session.destroy();
  res.render("login");
  console.log("logouted");
});

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   var err = new Error("Not Found");
//   err.status = 404;
//   next(err);
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.status = err.status;

  if (err.stack && err.status != 401)
    res.locals.stack = err.stack;
  else
    res.locals.stack = null;

  res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log(err.stack)
  // render the error page
  res.status(err.status || 500);
  res.render("error", {
    title: "Error"
  });
});

server.listen(PORT, () => {
  console.log("Sever on port: " + PORT);
});