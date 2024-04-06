const express = require("express");
const router = express.Router();

const exercisesController = require('../controllers/exercisesController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/:lessonSequence")
    .all(checkUser.requireLogin)
    .get(exercisesController.showLessonExercises);
    
    
module.exports = router;