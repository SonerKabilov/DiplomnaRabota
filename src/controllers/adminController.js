const sectionsService = require('../services/sectionsService');
const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const coursesService = require('../services/coursesService');

module.exports = {
    showAdminPage: async (req, res) => {
        const courses = await coursesService.getCourses();
        const sections = await sectionsService.getAllSections();

        const adminPageDetails = {
            courses: courses,
            sections: sections
        }

        res.status(200).render("admin/admin", { adminPageDetails });
    },
    showLessons: async (req, res) => {
        const { sectionSequence } = req.params;
        const lessons = await lessonsService.getAllLessons(sectionSequence);
        const sectionDescription = await sectionsService.getSectionDescription(sectionSequence);

        const sectionDetails = {
            sectionSequence: sectionSequence,
            lessons: lessons,
            sectionDescription: sectionDescription
        }

        res.render("admin/showLessons", { sectionDetails })
    },
    showAddExerciseForm: (req, res) => {
        const { lessonSequence } = req.params;

        res.render("admin/addExercise", { lessonSequence });
    },
    showAddSectionForm: (req, res) => {
        const { courseId } = req.params;

        res.render("admin/addSection", { courseId });
    },
    showLessonDetails: async (req, res) => {
        const { lessonSequence } = req.params;
        const exercises = await exercisesService.getAllLessonExercises(lessonSequence);
        const lessonPreview = await lessonsService.getLessonPreview(lessonSequence);

        const lessonDetails = {
            lessonSequence: lessonSequence,
            exercises: exercises,
            lessonPreview: lessonPreview
        }

        res.render("admin/showLessonDetails", { lessonDetails });
    },
    addSection: async (req, res) => {
        const { courseId } = req.params;
        const section = req.body;

        const newSection = {
            courseId: courseId,
            description: section.description,
            sectionType: section.sectionTypes
        }

        await sectionsService.addSection(newSection);

        res.status(201).redirect("/admin")
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