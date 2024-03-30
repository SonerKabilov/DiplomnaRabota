const coursesService = require('../services/coursesService');
const sectionsService = require('../services/sectionsService');

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
}