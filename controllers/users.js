var services = require('../services');

module.exports.deleteuser = async function (req, res, next) {
    var details = await services.user.deleteuser({
        "_id": req.body._id
    });
    res.send(details);
}

module.exports.getProfile = async function (req, res) {
    services.user.getProfile({
        "_id": req.session._id
    }, req, res);
}

module.exports.updateProfile = async function (req, res) {
    services.user.updateProfile({
        "_id": req.session._id
    }, req, res);
}

module.exports.getUserTable = async function (req, res) {
    services.tabledata.getUserTable({
        "_id": req.session._id
    }, req, res);
}

module.exports.changepassword = async function (req, res) {
    services.user.changepassword({
        "_id": req.session._id
    }, req, res);
}

module.exports.register = async function (req, res) {
    services.user.register({
        "_id": req.session._id
    }, req, res);
}

module.exports.checkLogin = async function (req, res) {
    services.user.checkLogin({
        "_id": req.session._id
    }, req, res);
}