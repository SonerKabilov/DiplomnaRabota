const express = require("express");
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

router
    .route("/:lessonSequence")
    .get(exercisesController.showLessonExercises);
    
module.exports = router;