const express = require("express");
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

router.get("/:lessonSequence", exercisesController.showLessonExercises);
router.post("/:lessonSequence/add");

module.exports = router;