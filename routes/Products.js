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

app.get("/getFruits", function (req, res) {
    producttable
        .find({
            category: "Fruits"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                res.send(result);
            }
        });
});
app.get("/getJuice", function (req, res) {
    producttable
        .find({
            category: "Juice"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                res.send(result);
            }
        });
});
app.get("/getVegetable", function (req, res) {
    producttable
        .find({
            category: "Vegetable"
        })
        .exec(function (error, result) {
            if (error) throw error;
            else {
                res.send(result);
            }
        });
});

module.exports = app