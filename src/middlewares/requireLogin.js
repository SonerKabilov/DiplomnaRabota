module.exports.requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect("/login");
    }

    next();
}

module.exports.checkUserType = (req, res, next) => {
    if(req.session.user_type == 2) {
        req.session.destroy();
        return res.redirect('/');
    }

    next();
}

module.exports.checkIfUserIsLogged = (req, res, next) => {
    if(req.session.user_id) {
        req.session.destroy();
        return res.redirect('/');
    }

    next();
}