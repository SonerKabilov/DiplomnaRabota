const exercisesService = require('../services/exercisesService');

module.exports = {
    showLessonExercises: async (req, res) => {
        try {
            const { lessonSequence } = req.params;
            const exercises = await exercisesService.getAllLessonExercises(lessonSequence);
            
            res.status(200).render("user/exercises", { exercises, lessonSequence });
        } catch(error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    }
}