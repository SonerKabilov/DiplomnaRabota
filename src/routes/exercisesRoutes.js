const express = require("express");
const router = express.Router();

const exercisesController = require('../controllers/exercisesController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/:language/section/:sectionSequence/lesson/:lessonSequence")
    .all(checkUser.requireLogin)
    .get(exercisesController.showLessonExercises)
    .patch(exercisesController.updateCompletedLesson);

router
    .route("/:language/section/:sectionSequence/lesson/:lessonSequence/return")
    .all(checkUser.requireLogin)
    .get(exercisesController.returnToLessonsPage);

    
module.exports = router;