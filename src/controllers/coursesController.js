const coursesService = require('../services/coursesService');
const sectionsService = require('../services/sectionsService');
const languages = require('../utils/languages');

module.exports = {
    showCourses: async (req, res) => {
        const courses = await coursesService.getCourses();
        const sections = await sectionsService.getAllSections();

        const adminPageDetails = {
            courses,
            sections
        }

        res.status(200).render("admin/admin", { adminPageDetails });
    },
    showAvailableCourses: async (req, res) => {
        const courses = await coursesService.getCourses();
        const coursesTaken = req.session.user_courses;

        res.status(200).render("user/startCourseForm", { coursesTaken, courses });
    },
    addCourseForm: async (req, res) => {
        const languagesToAdd = await coursesService.checkIfCourseIsAdded(languages);

        res.render('admin/addCourseForm', { languagesToAdd })
    },
    addCourse: async (req, res) => {
        const body = req.body;

        const parsedLanguageData = JSON.parse(body.languageData);

        const languageData = {
            language: parsedLanguageData.language,
            cyrillicName: parsedLanguageData.cyrillicName,
            flag: parsedLanguageData.flag
        }

        coursesService.addCourse(languageData);

        req.flash("success", "Успешно добавяне на курс!");

        res.redirect("/admin");
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

        res.redirect(`/section/1/${parsedLanguageData.language}/lessons`);
    }
}