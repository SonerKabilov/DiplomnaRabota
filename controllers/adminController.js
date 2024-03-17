const section = require('../models/sectionModel');
const lesson = require('../models/lessonModel');

module.exports = {
    showAdminPage: async (req, res) => {
        const sections = await section.queryAllSections();
        res.status(200).render("admin/admin", { sections });
    },
    showLessons: async (req, res) => {
        const { sectionSequence } = req.params;
        const lessons = await lesson.queryLessons(sectionSequence);
        res.render("admin/showLessons", { lessons })
    },
    showAddExerciseForm: (req, res) => {
        res.render("admin/addExercise");
    },
    showAddSectionForm: (req, res) => {
        res.render("admin/addSection");
    },
    showLessonDetails: async (req, res) => {
        const { lessonSequence } = req.params;
        const lessonDetails = await lesson.queryLessonExercises(lessonSequence);
        res.render("admin/showLessonDetails", { lessonDetails });
    },
    addExercise: (req, res) => {
        // const lesson = req.body;
        res.send(req.body)
    }
}