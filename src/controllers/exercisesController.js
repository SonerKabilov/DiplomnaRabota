const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');
const sectionsService = require('../services/sectionsService');

module.exports = {
    showLessonExercises: async (req, res) => {
        try {
            const { language, sectionSequence, lessonSequence } = req.params;

            const sectionDetails = {
                language,
                sectionSequence
            }

            const sectionId = await sectionsService.getSectionIdByLanguage(sectionDetails)
            
            const exercises = await exercisesService.getAllLessonExercises(sectionId, lessonSequence);
            
            res.status(200).render("user/exercises", { exercises, lessonSequence, sectionSequence, language });
        } catch(error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showAddExerciseForm: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        const checkIfLessonExists = await lessonsService.getLessonId(lessonSequence, sectionId);

        if(!checkIfLessonExists) {
            req.flash("error", "Не съществува такъв урок");
            
            return res.redirect("/admin");
        }

        res.render("admin/addExercise", { language, sectionId, lessonSequence });
    },
    addExercise: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;
        const exercise = req.body;

        if (
            exercise.task == "" ||
            exercise.correctAnswer == ""
        ) {
            req.flash("error", "Полетата за 'Задание' и 'Правилен отговор' са задължителни полета!");

            return res
                .status(400)
                .redirect(`/admin/add/${language}/sectionId/${sectionId}/lesson/${lessonSequence}/exercise`);
        }

        const lessonId = await lessonsService.getLessonId(lessonSequence, sectionId);

        const newExercise = {
            task: exercise.task,
            taskTypesId: exercise.taskTypes,
            optionTypesId: exercise.optionTypes,
            options: exercise.options,
            correctAnswer: exercise.correctAnswer,
            lessonId
        }

        const addedExercise = await exercisesService.addExercise(newExercise);

        if(addedExercise) {
            req.flash("success", "Успешно добавено упражнение!");

            res
                .status(201)
                .redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } else {
            req.flash("error", "Грешни данни за упражнение!");

            res
                .status(400)
                .redirect(`/admin/add/${language}/sectionId/${sectionId}/lesson/${lessonSequence}/exercise`);
        }
    }
}