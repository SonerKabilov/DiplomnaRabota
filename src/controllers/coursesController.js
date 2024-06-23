const coursesService = require('../services/coursesService');
const sectionsService = require('../services/sectionsService');
const { findFlagUrlByIso2Code } = require('country-flags-svg');

module.exports = {
    showCourses: async (req, res) => {
        const userType = req.session.user_type;
        const courses = await coursesService.getCourses();
        const sections = await sectionsService.getAllSections();
        const premiumSections = await sectionsService.getAllPremiumSections();

        const adminPageDetails = {
            courses,
            sections,
            premiumSections
        }

        res.status(200).render("admin/admin", { adminPageDetails, userType });
    },
    showAvailableCourses: async (req, res) => {
        const courses = await coursesService.getCourses();

        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;

        const userData = {
            userCurrency,
            coursesTaken
        }

        res.status(200).render("user/startCourseForm", { userData, courses, language });
    },
    addCourseForm: async (req, res) => {
        const userType = req.session.user_type;

        res.render('admin/addCourseForm', { userType })
    },
    addCourse: async (req, res) => {
        const body = req.body;

        try {
            const flag = findFlagUrlByIso2Code(body.iso2);

            if (flag != "") {
                const languageData = {
                    language: body.language,
                    cyrillicName: body.cyrillicName,
                    flag
                }

                coursesService.addCourse(languageData);

                req.flash("success", "Успешно добавяне на курс!");

                res.redirect("/admin");
            } else {
                req.flash("error", "Грешка в ISO2 код!");
                res.redirect("/admin/add/course");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Неуспешно добавяне на курс!");
            res.redirect("/admin/add/course");
        }

    },
    addCourseForUser: async (req, res) => {
        const body = req.body;
        const userId = req.session.user_id;

        const parsedLanguageData = JSON.parse(body.languageData);

        const addCourseData = {
            courseId: parsedLanguageData.id,
            userId
        }

        await coursesService.addCourseForUser(addCourseData);

        const userCourses = await coursesService.getUserCourses(userId);
        req.session.user_courses = userCourses;

        res.redirect(`/${parsedLanguageData.language}/free/lessons`);
    }
}