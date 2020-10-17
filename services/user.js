var Users = require("../models/Users");
var bcrypt = require("bcrypt");
const saltRounds = 10;

exports.deleteuser = async function (query) {
    Users.deleteOne(query, function (error, result) {
        if (error) {
            throw new Error("Error while Deleting Users by Admin")
            return "0";
        } else
            return "1";
    })
}

exports.getProfile = async function (query, req, res) {
    Users.findOne({
        "_id": req.session.passport.user._id
    }).exec(function (err, result) {
        if (err) throw new Error("Error while Getting Profile of Users")
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
                data: req.session.passport.user,
                shownavpro: "false",
                title: req.session.passport.user.name + " Profile's",
                newdata: add
            });
        }
    });
}

exports.updateProfile = async function (query, req, res) {
    Users.updateOne({
            "_id": req.session.passport.user._id
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
                throw new Error("Error while Updating Users Profile")
            } else {
                req.flash('success', 'Profile Updated');
            }
            if (req.session.passport.user.type == "Customer")
                return res.redirect('/home');
            else if (req.session.passport.user.type == "Seller")
                return res.redirect('/sellerpage');
            else if (req.session.passport.user.type == "Admin")
                return res.redirect('/adminpage');
        })
}

exports.changepassword = async function (query, req, res) {
    Users.findOne({
        "_id": req.session.passport.user._id
    }).then((result) => {
        if (result) {
            bcrypt.compare(req.body.oldpass, result.password, function (err, boolans) {
                if (err) {
                    err = new Error("Error in Comparing Password in Changing Password")
                    err.status = 500;
                    return next(err);
                }
                if (boolans == true) {
                    bcrypt.hash(req.body.newpass, saltRounds, function (err, newpass) {
                        if (err) {
                            err = new Error("Error in Comparing Password in Changing Password")
                            err.status = 500;
                            return next(err);
                        }
                        Users.updateOne({
                            "_id": req.session.passport.user._id,
                        }, {
                            $set: {
                                "password": newpass
                            }
                        }).then((result) => {
                            if (result == null)
                                req.flash('errors', 'Password failed to Update.');
                            else
                                req.flash('success', 'Password Updated.');
                            return res.redirect('/user/changepasswordpage');
                        }).catch((err) => {
                            err.message = new Error('Internal Server Error');
                            err.status = 500;
                            return next(err);
                        });
                    });
                } else {
                    req.flash('errors', 'Old Password Incorrect.');
                    return res.redirect('/user/changepasswordpage');
                }
            });

        } else {
            req.flash('errors', 'Error in Changing Password');
            return res.redirect('/user/changepasswordpage');
        }
    }).select("+password").catch((err) => {
        err.message = new Error('Internal Server Error');
        err.status = 500;
        return next(err);
    });
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