var Users = require("../models/Users");
var product = require('../models/products');

exports.getProductTable = async function (query1, req, res) {
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

    product.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            product.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    product.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else {
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
}


exports.getUserTable = async function (query1, req, res) {
    let query = {};
    let params = {};

    if (req.body.search.value) {
        query["$or"] = [{
                "email": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "name": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "phoneno": {
                    "$regex": req.body.search.value,
                    "$options": "i"
                }
            },
            {
                "state": {
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
                email: sortingType
            }
        };
    else if (req.body.order[0].column === '3')
        params = {
            skip: parseInt(req.body.start),
            limit: parseInt(req.body.length),
            sort: {
                state: sortingType
            }
        };

    Users.find(query, {}, params, function (err, data) {
        if (err)
            console.log(err);
        else {
            Users.countDocuments(query, function (err, filteredCount) {
                if (err)
                    console.log(err);
                else {
                    Users.countDocuments(function (err, totalCount) {
                        if (err)
                            console.log(err);
                        else
                            res.send({
                                "recordsTotal": totalCount,
                                "recordsFiltered": filteredCount,
                                data
                            });
                    })
                }
            });
        }
    });
}