function checkSession(req, res, next) {
    if (req.session.isLogin)
        next();
    else
        res.redirect('/');
}

function checkCustomer(req, res, next) {
    if (req.session.data.type == "Customer")
        next();
    else
        res.redirect('/');
}

function checkAdmin(req, res, next) {
    if (req.session.data.type == "Admin")
        next();
    else
        res.redirect('/');
}

function checkSeller(req, res, next) {
    if (req.session.data.type == "Seller")
        next();
    else
        res.redirect('/');
}

// Exporting all the modules
module.exports.checkSession = checkSession;
module.exports.checkCustomer = checkCustomer;
module.exports.checkAdmin = checkAdmin;
module.exports.checkSeller = checkSeller;