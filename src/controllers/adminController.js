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
        const { lessonSequence } = req.params;

        res.render("admin/addExercise", { lessonSequence });
    },
    showAddSectionForm: (req, res) => {
        res.render("admin/addSection");
    },
    showLessonDetails: async (req, res) => {
        const { lessonSequence } = req.params;
        const lessonDetails = await exercisesService.getAllLessonExercises(lessonSequence);
        
        res.render("admin/showLessonDetails", { lessonDetails, lessonSequence });
    },
    addExercise: async (req, res) => {
        const { lessonSequence } = req.params;
        const exercise = req.body;

        if (
            exercise.task == "" ||
            exercise.correctAanswer == ""
        ) {
            res
                .status(400)
                .send({
                    status: "FAILED",
                    data: {
                        error:
                            "One of the following keys is missing or is empty in request body: 'task', 'correctAanswer'",
                    },
                });
            return;
        }

        const lessonId = await lessonsService.getLessonId(lessonSequence);
        await exercisesService.addExercise(exercise, lessonId);
        
        res.status(201).redirect("/admin/show/lesson/" + lessonSequence);
    },
    addLesson: async (req, res) => {
        const { sectionSequence } = req.params;
        const sectionId = await sectionsService.getSectionId(sectionSequence);

        await lessonsService.addLesson(sectionId);
        res.redirect("/admin/show/" + sectionSequence + "/lessons");
    }
}