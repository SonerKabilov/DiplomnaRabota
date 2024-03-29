const exercisesRepository = require('../database/repositories/exercisesRepository');

module.exports = {
    getAllLessonExercises: async (lessonSequence) => {
        const exercises = await exercisesRepository.queryLessonExercises(lessonSequence);
        
        return exercises;
    },
    addExercise: async (newExercise) => {
        for (let option of newExercise.options) {
            if (option == "") {
                const index = newExercise.options.indexOf(option);
                newExercise.options.splice(index, 1);
            }
        }

        newExercise.options = JSON.stringify(newExercise.options);

        await exercisesRepository.insertExercise(newExercise);
    }
}