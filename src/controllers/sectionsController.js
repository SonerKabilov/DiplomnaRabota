const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');

module.exports = {
    getLessons: async (req, res) => {
        try {
            const { sectionSequence } = req.params;
            const sections = await sectionsService.getAllSections();
            const lessons = await lessonsService.getAllLessons(sectionSequence);

            res.status(200).render("user/lessons", { sections, lessons });
        } catch(error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}