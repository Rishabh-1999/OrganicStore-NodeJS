const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require("bcrypt");

const Users = require("../models/Users");

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({
            usernameField: 'email'
        }, (email, password, done) => {
            Users.findOne({
                    email: email
                },
                function (err, result) {
                    if (result) {
                        bcrypt.compare(password, result.password, function (
                            err,
                            password
                        ) {

                            if (password) {
                                var user = new Object();
                                user._id = result._id;
                                user.name = result.name;
                                user.email = result.email;
                                user.gender = result.gender;
                                user.city = result.city;
                                user.DOB = result.DOB;
                                user.totalincart = result.totalincart;
                                user.phoneno = result.phoneno;
                                user.type = result.type;
                                console.log("-------------------Logined--------------------")
                                return done(null, user);
                            } else {
                                return done(null, false, {
                                    errors: 'Username/Password Incorrect.'
                                });
                            }
                        });
                    } else {
                        return done(null, false, {
                            errors: 'Username/Password Incorrect.'
                        });
                    }
                }
            ).select("+password").catch(err => {
                res.send(error);
            });
        })
    );

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        Users.findById(id, function (err, user) {
            done(null, user);
        });
    });
};