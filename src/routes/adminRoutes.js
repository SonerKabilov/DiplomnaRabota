const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get("/", adminController.showAdminPage);
router.get("/show/:sectionSequence/lessons", adminController.showLessons);
router.get("/show/lesson/:lessonSequence", adminController.showLessonDetails);
router.get("/add/exercise", adminController.showAddExerciseForm);
router.get("/add/section", adminController.showAddSectionForm);
router.post("/add/exercise", adminController.addExercise);

module.exports = router;