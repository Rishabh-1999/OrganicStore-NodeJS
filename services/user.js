var Users = require("../models/Users");
var bcrypt = require("bcrypt");
const saltRounds = 10;

exports.deleteuser = async function (query) {
    Users.deleteOne(query, function (error, result) {
        if (error) {
            console.log(error);
            return "0";
        } else
            return "1";
    })
}

exports.getProfile = async function (query, req, res) {
    Users.findOne({
        "_id": req.session._id
    }).exec(function (err, result) {
        if (err) console.log(err);
        else {
            var add = new Object;
            add.address1 = result.address1;
            add.address2 = result.address2;
            add.state = result.state;
            add.city = result.city;
            add.phoneno = result.phoneno;
            add.DOB = result.DOB;
            add.gender = add.gender;
            add.zipcode = result.zipcode;
            res.render("profile", {
                data: req.session.data,
                shownavpro: "false",
                newdata: add
            });
        }
    });
}

exports.updateProfile = async function (query, req, res) {
    Users.updateOne({
            "_id": req.session._id
        }, {
            $set: {
                "name": req.body.name,
                "gender": req.body.gender,
                "DOB": req.body.DOB,
                "phoneno": req.body.phoneno,
                "address1": req.body.address1,
                "address2": req.body.address2,
                "city": req.body.city,
                "state": req.body.state,
                "zipcode": req.body.zipcode
            }
        },
        function (error, result) {
            if (error) {
                req.flash('errors', 'Profile failed to update.');
            } else {
                req.flash('success', 'Profile Updated');
            }
            if (req.session.data.type == "Customer")
                return res.redirect('/home');
            else if (req.session.data.type == "Seller")
                return res.redirect('/sellerpage');
            else if (req.session.data.type == "Admin")
                return res.redirect('/adminpage');
        })
}

exports.changepassword = async function (query, req, res) {
    Users.findOne({
        "_id": req.session._id
    }, function (error, result) {
        if (error)
            throw error;
        else {
            if (result == null)
                res.send("0");
            else {
                bcrypt.compare(req.body.oldpass, result.password, function (err, boolans) {
                    if (boolans == true) {
                        bcrypt.hash(req.body.newpass, saltRounds, function (err, newpass) {
                            Users.updateOne({
                                "_id": req.session._id,
                            }, {
                                $set: {
                                    "password": newpass
                                }
                            }, function (error, result) {
                                if (error)
                                    throw error;
                                else {
                                    if (result == null)
                                        req.flash('errors', 'Password failed to Update.');
                                    else
                                        req.flash('success', 'Password Updated.');
                                    return res.redirect('/user/changepasswordpage');
                                }
                            });
                        });
                    } else {
                        req.flash('errors', 'Old Password Incorrect.');
                        return res.redirect('/user/changepasswordpage');
                    }
                });
            }
        }
    }).select("+password");
}

exports.register = async function (query, req, res) {
    Users.findOne({
        email: req.body.email
    }, function (err, result) {
        if (result) {
            req.flash('errors', 'Account with that email address already exists');
            return res.redirect('/register');
        } else {
            bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
                let us = new Users({
                    "name": req.body.name,
                    "email": req.body.email,
                    "phoneno": req.body.phoneno,
                    "gender": req.body.gender,
                    "DOB": req.body.DOB,
                    "password": hash,
                    "address1": req.body.address1,
                    "address2": req.body.address2,
                    "city": req.body.city,
                    "state": req.body.state,
                    "zipcode": req.body.zipcode,
                    "type": "Customer",
                    "totalincart": 0,
                    "cart": [],
                    "ordered": []
                })
                us.save()
                    .then(data => {
                        req.flash('success', 'Registered Successfully');
                        res.redirect('/');
                    })
                    .catch(err => {
                        console.log(err)
                    })
            });
        }
    })
}

exports.checkLogin = async function (query, req, res) {
    Users.findOne({
            email: req.body.email
        },
        function (err, result) {
            if (result) {
                bcrypt.compare(req.body.password, result.password, function (
                    err,
                    password
                ) {
                    if (password) {
                        req.session.isLogin = 1;
                        req.session._id = result._id;
                        req.session.name = result.name;
                        req.session.password = req.body.password;
                        var ob = new Object();
                        ob.name = result.name;
                        ob._id = result._id;
                        ob.email = result.email;
                        ob.gender = result.gender;
                        ob.city = result.city;
                        ob.DOB = result.DOB;
                        ob.totalincart = result.totalincart;
                        ob.phoneno = result.phoneno;
                        ob.type = result.type;
                        req.session.name = result.name;
                        req.session.data = ob;
                        console.log("-------------------Logined--------------------")
                        if (req.session.data.type == "Customer") res.redirect('/home');
                        else if (req.session.data.type == "Admin") res.redirect("/adminpage");
                        else if ((req.session.data.type = "Seller"))
                            res.redirect("/sellerpage");
                    } else {
                        req.flash('errors', 'Username/Password Incorrect.');
                        return res.redirect('/');
                    }
                });
            } else {
                req.flash('errors', 'Username/Password Incorrect.');
                return res.redirect('/');
            }
        }
    ).select("+password").catch(err => {
        res.send(error);
    });
}