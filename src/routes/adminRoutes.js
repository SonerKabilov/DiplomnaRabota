const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get("/", adminController.showAdminPage);

router.get("/show/:sectionSequence/lessons", adminController.showLessons);
router.patch("/show/:sectionSequence/lessons", adminController.updateSectionDescription);

router.get("/show/lesson/:lessonSequence", adminController.showLessonDetails);

router.get("/add/:lessonSequence/exercise", adminController.showAddExerciseForm);
router.post("/add/:lessonSequence/exercise", adminController.addExercise);

router.get("/add/:courseId/section", adminController.showAddSectionForm);
router.post("/add/:courseId/section", adminController.addSection);

router.post("/add/:sectionSequence/lesson", adminController.addLesson);

module.exports = router;