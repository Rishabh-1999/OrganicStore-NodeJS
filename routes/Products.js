const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const app = express.Router();
const multer = require("multer");
var cloundinary = require("cloudinary").v2;
var fileupload = require("express-fileupload");

app.use(fileupload({
    useTempFiles: true
}));

cloundinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECERT
});

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

// Middleware
var middleware = require("../middleware/middleware");

// Controllers
var controllers = require("../controllers");

/* GET get Fruit Product */
app.get(
    "/getAllFruits",
    middleware.checkSession,
    controllers.product.getAllFruits
);

/* GET get Juice Product */
app.get(
    "/getAllJuice",
    middleware.checkSession,
    controllers.product.getAllJuice
);

/* GET get Vegetable Product */
app.get(
    "/getAllVegetable",
    middleware.checkSession,
    controllers.product.getAllVegetable
);

/* GET get Seller's selling product */
app.get(
    "/getSellerProduct",
    middleware.checkSession,
    middleware.checkSeller,
    controllers.product.getSellerProduct
);

/* MULTER */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/img/" + req.body.category);
    },
    filename: (req, file, cb) => {
        var photoname = req.body.productname + path.extname(file.originalname);
        cb(null, photoname);
    }
});

var upload = multer({
    storage: storage
}).single("productphoto");

/* POST Add Product */
app.post(
    "/addproduct",
    middleware.checkSession,
    middleware.checkSeller,
    function (req, res) {
        const file = req.files.productphoto;
        console.log(file);
        var reqpath =
            "organicstore/" + req.body.category + "/" + req.body.productname;
        cloundinary.uploader.upload(
            file.tempFilePath, {
                public_id: reqpath,
                overwrite: true
            },
            function (err, result) {
                if (err) console.log(err);
                else {
                    let newProduct = new producttable({
                            name: req.body.productname,
                            category: req.body.category,
                            price: req.body.price,
                            imgloc: result.url,
                            sellercompany: req.session.name
                        })
                        .save()
                        .then(data => {
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            res.write('<script>window.location= "/sellerpage"</script>');
                            res.end();
                        });
                }
            }
        );
        // let newProduct = new producttable({
        //     "name": req.body.productname,
        //     "category": req.body.category,
        //     "price": req.body.price,
        //     "imgloc": './img/' + req.body.category + '/' + req.file.filename,
        //     "sellercompany": req.session.name
        // })
        // upload(req, res, (err) => {
        //     if (err) {
        //         throw err;
        //     } else {
        //         newProduct.save()
        //             .then(data => {
        //                 res.writeHead(200, {
        //                     'Content-Type': 'text/html'
        //                 });
        //                 res.write('<script>window.location= "/sellerpage"</script>');
        //                 res.end();
        //             })
        //             .catch(err => {
        //                 console.log(err)
        //             })
        //     }
        // })
    }
);

/* POST get Product for Table */
app.post(
    "/getProductTable",
    middleware.checkSession,
    middleware.checkAdmin,
    controllers.product.getProductTable
);

/* POST delete Product */
app.post(
    "/deleteproduct",
    middleware.checkSession,
    middleware.checkAdmin,
    controllers.product.deleteproduct
);

module.exports = app;