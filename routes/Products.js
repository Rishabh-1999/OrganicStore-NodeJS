const express = require('express');
const path = require('path');
var bodyParser = require('body-parser')
const app = express.Router();
const multer = require('multer');
var passport = require('passport');
var mongojs = require('mongojs')
var bcrypt = require('bcrypt');
const saltRounds = 10;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}))

// parse application/json
app.use(bodyParser.json())

var producttable = require("../models/products");
var middleware = require('../middleware/middleware');

/* GET get Fruit Product */
app.get("/getFruits", middleware.checkSession, function (req, res) {
    producttable
        .find({
            category: "Fruits"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                console.log("GET /products/getFruits");
                res.send(result);
            }
        });
});

/* GET get Juice Product */
app.get("/getJuice", middleware.checkSession, function (req, res) {
    producttable
        .find({
            category: "Juice"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                console.log("GET /products/getJuice");
                res.send(result);
            }
        });
});

/* GET get Vegetable Product */
app.get("/getVegetable", middleware.checkSession, function (req, res) {
    producttable
        .find({
            category: "Vegetable"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                console.log("GET /products/getVegetable");
                res.send(result);
            }
        });
});

/* GET get Seller's selling product */
app.get("/getSellerProduct", middleware.checkSession, middleware.checkSeller, function (req, res) {
    producttable
        .find({
            sellercompany: req.session.name
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                console.log("GET /products/getSellerProduct");
                res.send(result);
            }
        });
});

/* MULTER */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/img/' + req.body.category)
    },
    filename: (req, file, cb) => {
        var photoname = req.body.productname + path.extname(file.originalname);
        cb(null, photoname)
    }
});

var upload = multer({
    storage: storage,
}).single('productphoto');

/* POST Add Product */
app.post('/addproduct', middleware.checkSession, middleware.checkSeller, (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            throw err;
        } else {
            let newProduct = new producttable({
                "name": req.body.productname,
                "category": req.body.category,
                "price": req.body.price,
                "imgloc": './img/' + req.body.category + '/' + req.file.filename,
                "sellercompany": req.session.name
            })
            newProduct.save()
                .then(data => {
                    console.log("POST /products/addproduct");
                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });
                    res.write('<script>window.location= "/sellerpage"</script>');
                    res.end();
                })
                .catch(err => {
                    console.log(err)
                })
        }
    })
})

/* POST get Product for Table */
app.post('/getProductTable', middleware.checkSession, middleware.checkAdmin, function (req, res) {
    let query = {};
    let params = {};

    if (req.body.search.value) {
        query["$or"] = [{
                "name": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "price": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "sellercompany": {
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
                price: sortingType
            }
        };
    else if (req.body.order[0].column === '3')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                sellercompany: sortingType
            }
        };

    producttable.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            producttable.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    producttable.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else {
                            console.log("POST /products/getProductTable");
                            res.send({
                                "recordsTotal": totalCount,
                                "recordsFiltered": filteredCount,
                                data
                            });
                        }
                    })
                }
            });
        }
    });
});

/* POST delete Product */
app.post("/deleteproduct", middleware.checkSession, middleware.checkAdmin, function (req, res) {
    producttable.deleteOne({
        "_id": req.body._id
    }, function (error, result) {
        if (error) {
            console.log(error);
            res.send("0");
        } else {
            console.log("POST /products/deleteproduct");
            res.send("1");
        }
    })
});

/* GET seller's Page */
app.get("/sellerpage", middleware.checkSession, middleware.checkSeller, function (req, res) {
    res.render("sellerpage", {
        data: req.session.data,
        shownavpro: "false"
    });
});

module.exports = app