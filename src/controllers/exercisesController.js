const lessonsService = require('../services/lessonsService');
const exercisesService = require('../services/exercisesService');

module.exports = {
    showLessonExercises: async (req, res) => {
        try {
            const { sectionId, lessonSequence } = req.params;
            
            const exercises = await exercisesService.getAllLessonExercises(sectionId, lessonSequence);
            
            res.status(200).render("user/exercises", { exercises, lessonSequence });
        } catch(error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    },
    showAddExerciseForm: (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;

        res.render("admin/addExercise", { language, sectionId, lessonSequence });
    },
    addExercise: async (req, res) => {
        const { language, sectionId, lessonSequence } = req.params;
        const exercise = req.body;

        if (
            exercise.task == "" ||
            exercise.correctAnswer == ""
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
            res.status(201).redirect(`/admin/show/${language}/sectionId/${sectionId}/lesson/${lessonSequence}`);
        } else {
            res.send("Incorrect data");
        }
    }
}