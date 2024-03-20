const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');

module.exports = {
    showAdminPage: async (req, res) => {
        const sections = await sectionsService.getAllSections();
        res.status(200).render("admin/admin", { sections });
    },
    showLessons: async (req, res) => {
        const { sectionSequence } = req.params;
        const lessons = await lessonsService.getAllLessons(sectionSequence);
        res.render("admin/showLessons", { sectionSequence, lessons })
    },
    showAddExerciseForm: (req, res) => {
        res.render("admin/addExercise");
    },
    showAddSectionForm: (req, res) => {
        res.render("admin/addSection");
    },
    showLessonDetails: async (req, res) => {
        const { lessonSequence } = req.params;
        const lessonDetails = await exercisesService.getAllLessonExercises(lessonSequence);
        res.render("admin/showLessonDetails", { lessonDetails });
    },
    addExercise: (req, res) => {
        // const lesson = req.body;
        res.send(req.body)
    },
    addLesson: async (req, res) => {
        const { sectionSequence } = req.params;
        const sectionId = await sectionsService.getSectionId(sectionSequence);
        await lessonsService.addLesson(sectionId);
        res.redirect("/admin/show/" + sectionSequence + "/lessons");
    }
}