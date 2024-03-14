const lesson = require('../models/lessonModel');

module.exports = {
    showLessonExercises: async (req, res) => {
        const { lessonSequence } = req.params;
        const exercises = await lesson.queryLessonExercises(lessonSequence);
        // res.send(exercises)
        res.status(200).render("user/exercises", { exercises, lessonSequence });
    }
}