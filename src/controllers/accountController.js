const accountService = require('../services/accountService');
const coursesService = require('../services/coursesService');

module.exports = {
    showHomePage: (req, res) => {
        res.render("user/home")
    },
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

        if (user) {
            req.session.user_id = user.id;
            req.session.user_type = user.user_types_id;

            res.redirect("/section/1/course/1/lessons");
        } else {
            req.flash("error", "Потребителското име или имейл са вече заети");
            res.redirect("/register");
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
            password: userBody.password,
            selectedLanguage: userBody.selectedLanguage
        }

        const user = await accountService.loginUser(userCredentials);

        if (user) {
            const userCourses = await coursesService.getUserCourses(user.id);
            req.session.user_id = user.id;
            req.session.user_type = user.user_types_id;
            req.session.user_courses = userCourses;

            if (req.session.user_type == 1) {
                res.redirect("/admin");
            } else {
                res.redirect(`/section/1/${userCredentials.selectedLanguage}/lessons`);
            }
        } else {
            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/login");
        }
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}