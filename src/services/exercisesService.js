const exercisesRepository = require('../database/repositories/exercisesRepository');

module.exports = {
    getAllLessonExercises: async (lessonSequence) => {
        const exercises = await exercisesRepository.queryLessonExercises(lessonSequence);
        return exercises;
    },
    addExercise: async (exercise, lessonId) => {
        for (let option of exercise.options) {
            if (option == "") {
                const index = exercise.options.indexOf(option);
                exercise.options.splice(index, 1);
            }
        }

        const exerciseToInsert = {
            task: exercise.task,
            options: JSON.stringify(exercise.options),
            correctAnswer: exercise.correctAnswer,
            exerciseLessonId: lessonId,
            taskTypesId: exercise.taskTypes,
            optionTypesId: exercise.optionTypes
        }

        await exercisesRepository.insertExercise(exerciseToInsert);
    }
}