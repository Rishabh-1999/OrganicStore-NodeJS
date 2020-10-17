const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcrypt");

const Users = require("../models/Users");

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

    passport.use(
        new LocalStrategy({
            usernameField: 'email',
            passReqToCallback: true
        }, (req, email, password, done) => {
            Users.findOne({
                email: email
            }).select("+password").then((result) => {
                if (result != null) {
                    bcrypt.compare(password, result.password, function (
                        err,
                        isMatch
                    ) {
                        if (err) {
                            err.message = new Error("Error in Authentication by \"Bcrypt\"")
                            err.status = 500;
                            return next(err);
                        }
                        if (isMatch) {
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
                            return done(null, false, req.flash('errors', 'Username/Password Incorrect.'));
                        }
                    });
                } else {
                    return done(null, false, req.flash('errors', 'Username Not registered.'));
                }
            }).catch(err => {
                err.message = new Error('Internal Server Error');
                err.status = 500;
                return next(err);
            });
        })
    );
};