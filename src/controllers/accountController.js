const accountService = require('../services/accountService');

module.exports = {
    showLoginForm: (req, res) => {
        res.render("user/login");
    },
    showUserRegisterForm: (req, res) => {
        res.render("user/register");
    },
    showAdminRegisterForm: (req, res) => {
        res.render("admin/adminRegister");
    },
    createUser: async (req, res) => {
        const userBody = req.body;
        
        const userInformation = {
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
            passwordRepeat: userBody.passwordRepeat
        }

        const user = await accountService.createUser(userInformation);

        if(user) {
            req.session.user_id = user.id;
            req.session.user_type = user.user_types_id;

            res.redirect("/section/1/course/1/lessons");
        } else {
            res.send("Username or email is already taken");
        }
    },
    createAdmin: async (req, res) => {
        const userBody = req.body;
        
        const userInformation = {
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
            passwordRepeat: userBody.passwordRepeat,
            userTypesId: 1
        }

        await accountService.createUser(userInformation);

        res.redirect("/admin");
    },
    loginUser: async (req, res) => {
        const userBody = req.body;

        const userCredentials = {
            username: userBody.username,
            password: userBody.password
        }

        const user = await accountService.loginUser(userCredentials);

        if(user) {
            req.session.user_id = user.id;
            req.session.user_type = user.user_types_id;

            if(req.session.user_type == 1) {
                res.redirect("/admin");
            } else {
                res.redirect("/section/1/course/1/lessons");
            }
        } else {
            res.send("WRONG CREDENTIALS")
        }
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/login');
    }
}