const services = require("../services");
const passport = require("passport")

module.exports.deleteuser = async function (req, res, next) {
    res.send(details = await services.user.deleteuser({
        _id: req.body._id
    }));
};

module.exports.getProfile = async function (req, res) {
    await services.user.getProfile({
            _id: req.session.passport.user._id
        },
        req,
        res
    );
};

module.exports.updateProfile = async function (req, res) {
    await services.user.updateProfile({
            _id: req.session.passport.user._id
        },
        req,
        res
    );
};

module.exports.getUserTable = async function (req, res) {
    await services.tabledata.getUserTable({
            _id: req.session.passport.user._id
        },
        req,
        res
    );
};

module.exports.changepassword = async function (req, res) {
    await services.user.changepassword({
            _id: req.session.passport.user._id
        },
        req,
        res
    );
};

module.exports.register = async function (req, res) {
    await services.user.register({
            _id: req.session.passport.user._id
        },
        req,
        res
    );
};

module.exports.checkLogin = async function (req, res) {
    passport.authenticate('local.login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
};