const exercisesRepository = require('../database/repositories/exercisesRepository');

module.exports = {
    getAllLessonExercises: async (lessonSequence) => {
        const exercises = await exercisesRepository.queryLessonExercises(lessonSequence);
        return exercises;
    }
}