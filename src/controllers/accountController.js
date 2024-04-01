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

        await accountService.createUser(userInformation);

        res.redirect("/register");
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
    }
}