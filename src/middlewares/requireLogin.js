module.exports.requireLogin = (req, res, next) => {
    if(!req.session.user_id) {
        return res.redirect("/login");
    }

    next();
}

module.exports.checkUserType = (req, res, next) => {
    if(req.session.user_type != 1) {
        return res.redirect("/section/1/course/1/lessons");
    }

    next();
}

module.exports.checkIfUserIsLogged = (req, res, next) => {
    if(req.session.user_id) {
        return res.redirect("/section/1/course/1/lessons");
    }

    next();
}