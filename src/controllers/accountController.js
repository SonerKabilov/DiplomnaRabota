const accountService = require('../services/accountService');
const coursesService = require('../services/coursesService');

module.exports = {
    showHomePage: (req, res) => {
        res.render("user/home")
    },
    showLoginForm: (req, res) => {
        res.render("user/login");
    },
    showAdminLogin: (req, res) => {
        res.render("admin/adminLogin");
    },
    showUserRegisterForm: async (req, res) => {
        const courses = await coursesService.getCourses();
        const coursesTaken = [];

        const userData = {
            coursesTaken
        }

        res.render("user/register", { courses, userData });
    },
    showAdminRegisterForm: (req, res) => {
        const userType = req.session.user_type;

        if (userType == 3) {
            res.render("admin/adminRegister", { userType });
        } else {
            res.redirect("admin");
        }
    },
    createUser: async (req, res) => {
        const userBody = req.body;
        const parsedLanguageData = JSON.parse(userBody.languageData);

        const userInformation = {
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
            passwordRepeat: userBody.passwordRepeat,
            courseId: parsedLanguageData.id
        }

        try {
            const user = await accountService.createUser(userInformation);

            if (user === "Username and password taken") {
                req.flash("error", "Потребителското име или имейл са вече заети");
                res.redirect("/register");
            } else if (user === "False regex") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/register");
            } else if (user === "Password does not match") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/register");
            } else {
                const userCourses = await coursesService.getUserCourses(user[0].id);

                req.session.user_id = user[0].id;
                req.session.user_type = user[0].user_types_id;
                req.session.user_courses = userCourses;

                res.redirect(`/${parsedLanguageData.language}/free/lessons`);
            }
        } catch (error) {
            console.log(error);
            
            req.flash("error", "Неуспешно създаване на потребител");
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

        try {
            const user = await accountService.createUser(userInformation);

            if (user === "Username and password taken") {
                req.flash("error", "Потребителското име или имейл са вече заети");
                res.redirect("/admin/create/account");
            } else if (user === "False regex") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/create/account");
            } else if (user === "Password does not match") {
                req.flash("error", "Невалидни потребителски данни");
                res.redirect("/admin/create/account");
            } else {
                req.flash("success", "Усешно създаден профил");

                res.redirect(`/admin/create/account`);
            }
        } catch (error) {
            req.flash("error", "Неуспешно създаване на потребител");
            res.redirect("/admin/create/account");
        }
    },
    loginUser: async (req, res) => {
        const userBody = req.body;

        const userCredentials = {
            username: userBody.username,
            password: userBody.password,
            selectedLanguage: userBody.selectedLanguage
        }

        try {
            const user = await accountService.loginUser(userCredentials);

            if (user && user.user_types_id == 2) {
                const userCourses = await coursesService.getUserCourses(user.id);

                req.session.user_id = user.id;
                req.session.user_type = user.user_types_id;
                req.session.user_currency = user.currency;
                req.session.user_courses = userCourses;


                res.redirect(`/${userCredentials.selectedLanguage}/free/lessons`);
            } else {
                req.flash("error", "Грешно потребителско име или парола");
                res.redirect("/login");
            }
        } catch (error) {
            console.log(error);

            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/login");
        }
    },
    loginAdmin: async (req, res) => {
        const userBody = req.body;

        const userCredentials = {
            username: userBody.username,
            password: userBody.password,
            selectedLanguage: userBody.selectedLanguage
        }

        try {
            const user = await accountService.loginUser(userCredentials);

            if (user && (user.user_types_id == 1 || user.user_types_id == 3)) {
                const userCourses = await coursesService.getUserCourses(user.id);

                req.session.user_id = user.id;
                req.session.user_type = user.user_types_id;
                req.session.user_currency = user.currency;
                req.session.user_courses = userCourses;

                res.redirect("/admin");
            } else {
                req.flash("error", "Грешно потребителско име или парола");
                res.redirect("/admin/login");
            }
        } catch (error) {
            console.log(error);

            req.flash("error", "Грешно потребителско име или парола");
            res.redirect("/admin/login");
        }
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}