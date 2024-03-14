const section = require('../models/sectionModel');


module.exports = {
    getLessons: async (req, res) => {
        const { id } = req.params;
        const sections = await section.queryAllSections();
        const lessons = await section.queryLessons(id);
        res.status(200).render("user/lessons", { sections, lessons });
    }
}