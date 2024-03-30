const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const sectionsService = require('../services/sectionsService');
const coursesService = require('../services/coursesService');

module.exports = {
    showLessonDetails: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        const exercises = await exercisesService.getAllLessonExercises(sectionId, lessonSequence);
        const lessonPreview = await lessonsService.getLessonPreview(lessonSequence, sectionId);

        const lessonDetails = {
            language,
            sectionId,
            lessonSequence,
            exercises,
            lessonPreview
        }

        res.render("admin/showLessonDetails", { lessonDetails });
    },
    addLesson: async (req, res) => {
        const { language, sectionSequence } = req.params;

        const courseId = await coursesService.getCourseId(language);

        const sectionDetails = {
            courseId,
            sectionSequence
        }

        const sectionId = await sectionsService.getSectionId(sectionDetails);

        await lessonsService.addLesson(courseId, sectionId);

        res.redirect(`/admin/show/${language}/section/${sectionSequence}/lessons`);
    },
    updateLessonPreview: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;
        const { lessonPreview } = req.body;

        const lessonToUpdate = {
            sectionId,
            lessonSequence,
            lessonPreview
        }

        await lessonsService.updateLessonPreview(lessonToUpdate);

        res.redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
    }
}