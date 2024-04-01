const express = require("express");
const router = express.Router();

const coursesController = require('../controllers/coursesController');
const sectionController = require('../controllers/sectionsController');
const lessonController = require('../controllers/lessonsController');
const exercisesController = require('../controllers/exercisesController');
const accountController = require('../controllers/accountController');

// ** COURSES **
router
    .route("/")
    .get(coursesController.showCourses);


// ** SECTIONS **
router
    .route("/show/:language/section/:sectionSequence/lessons")
    .get(sectionController.showSectionDetails)
    .patch(sectionController.updateSectionDescription);

router
    .route("/add/:courseId/section")
    .get(sectionController.showAddSectionForm)
    .post(sectionController.addSection);


// ** LESSONS **
router
    .route("/show/:language/sectionId/:sectionId/lesson/:lessonSequence")
    .get(lessonController.showLessonDetails)
    .patch(lessonController.updateLessonPreview);

router
    .route("/add/course/:language/section/:sectionSequence/lesson")
    .post(lessonController.addLesson);


// ** EXERCISES **
router
    .route("/add/:language/sectionId/:sectionId/lesson/:lessonSequence/exercise")
    .get(exercisesController.showAddExerciseForm)
    .post(exercisesController.addExercise);


// ** ACOUNT **
router
    .route("/create/account")
    .get(accountController.showAdminRegisterForm)
    .post(accountController.createAdmin)

module.exports = router;