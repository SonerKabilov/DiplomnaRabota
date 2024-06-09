const express = require("express");
const router = express.Router();

const exercisesController = require('../controllers/exercisesController');

const checkUser = require('../middlewares/requireLogin');

// FREE EXERCISES
router
    .route("/:language/section/:sectionSequence/lesson/:lessonSequence")
    .all(checkUser.requireLogin)
    .get(exercisesController.showLessonExercises);

router
    .route("/finish-lesson")
    .all(checkUser.requireLogin)
    .patch(exercisesController.updateCompletedLesson);

router
    .route("/finish-premium-lesson")
    .all(checkUser.requireLogin)
    .patch(exercisesController.updatePremiumCompletedLesson);

router
    .route("/section/:sectionId/lesson/:lessonSequence/get-exercises")
    .all(checkUser.requireLogin)
    .get(exercisesController.getFreeExercises);

router
    .route("/:exerciseId/:userAnswer/check-answer")
    .all(checkUser.requireLogin)
    .get(exercisesController.checkUserAnswer);


// PREMIUM EXERCISES
router
    .route("/:language/:type/lesson/:lessonSequence")
    .all(checkUser.requireLogin)
    .get(exercisesController.showPremiumExercises);

router
    .route("/:id/:type/lesson/:lessonSequence/get-images")
    .all(checkUser.requireLogin)
    .get(exercisesController.getStorymodeImages);


module.exports = router;