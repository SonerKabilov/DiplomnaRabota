const express = require("express");
const router = express.Router();

const coursesController = require('../controllers/coursesController');
const sectionController = require('../controllers/sectionsController');
const lessonController = require('../controllers/lessonsController');
const exercisesController = require('../controllers/exercisesController');
const accountController = require('../controllers/accountController');

const checkUser = require('../middlewares/requireLogin');

// ** COURSES **
router
    .route("/")
    .all(checkUser.checkUserType)
    .get(coursesController.showCourses);


// ** SECTIONS **
router
    .route("/show/:language/section/:sectionSequence/lessons")
    .all(checkUser.checkUserType)
    .get(sectionController.showSectionDetails)
    .patch(sectionController.updateSectionDescription);

router
    .route("/add/:courseId/section")
    .get(sectionController.showAddSectionForm)
    .post(sectionController.addSection);


// ** LESSONS **
router
    .route("/show/:language/sectionId/:sectionId/lesson/:lessonSequence")
    .all(checkUser.checkUserType)
    .get(lessonController.showLessonDetails)
    .patch(lessonController.updateLessonPreview);

router
    .route("/add/course/:language/section/:sectionSequence/lesson")
    .all(checkUser.checkUserType)
    .post(lessonController.addLesson);


// ** EXERCISES **
router
    .route("/add/:language/sectionId/:sectionId/lesson/:lessonSequence/exercise")
    .all(checkUser.checkUserType)
    .get(exercisesController.showAddExerciseForm)
    .post(exercisesController.addExercise);


// ** ACOUNT **
router
    .route("/create/account")
    .all(checkUser.checkUserType)
    .get(accountController.showAdminRegisterForm)
    .post(accountController.createAdmin)

    
module.exports = router;