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
    .route("/add/course")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(coursesController.addCourseForm)
    .post(coursesController.addCourse);

router
    .route("/")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(coursesController.showCourses);


// ** SECTIONS **
router
    .route("/show/:language/section/:sectionSequence/lessons")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(sectionController.showSectionDetails)
    .patch(sectionController.updateSectionDescription);

router
    .route("/add/:courseId/section")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(sectionController.showAddSectionForm)
    .post(sectionController.addSection);

router
    .route("/show/:language/:type/lessons")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(sectionController.showPremiumSectionDetails);


// ** LESSONS **
router
    .route("/show/:language/sectionId/:sectionId/lesson/:lessonSequence")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(lessonController.showLessonDetails)
    .patch(lessonController.updateLessonPreview);

router
    .route("/show/:language/:type/sectionId/:sectionId/lesson/:lessonSequence")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(lessonController.showPremiumLessonDetails)
    .patch();

router
    .route("/add/course/:language/section/:sectionSequence/lesson")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .post(lessonController.addLesson);

router
    .route("/add/course/:language/:type/lesson")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .post(lessonController.addPremiumLesson);


// ** EXERCISES **
router
    .route("/add/:language/sectionId/:sectionId/lesson/:lessonSequence/exercise")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(exercisesController.showAddExerciseForm)
    .post(exercisesController.addExercise);

router
    .route("/add/:language/:type/sectionId/:sectionId/lesson/:lessonSequence/exercise")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(exercisesController.showAddStorymodeExerciseForm)
    .post(exercisesController.addStorymodeExercise);


// ** ACOUNT **
router
    .route("/create/account")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(accountController.showAdminRegisterForm)
    .post(accountController.createAdmin)


module.exports = router;