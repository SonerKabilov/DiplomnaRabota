const express = require("express");
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.get("/:lessonSequence", lessonController.showLessonExercises);

module.exports = router;