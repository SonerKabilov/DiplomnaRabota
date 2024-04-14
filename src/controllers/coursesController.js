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
            iso2: parsedLanguageData.iso2,
            flag: parsedLanguageData.flag
        }

        res.send(languageData);
    }
}