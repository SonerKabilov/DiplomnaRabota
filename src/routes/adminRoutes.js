const express = require("express");
const router = express.Router();

const coursesController = require('../controllers/coursesController');
const sectionController = require('../controllers/sectionsController');
const lessonController = require('../controllers/lessonsController');
const exercisesController = require('../controllers/exercisesController');
const accountController = require('../controllers/accountController');
const shopController = require('../controllers/shopController');

const checkUser = require('../middlewares/requireLogin');
const upload = require('../middlewares/uploadFile');

// LOGIN
router
    .route("/login")
    .all(checkUser.checkIfUserIsLogged)
    .get(accountController.showAdminLogin)
    .post(accountController.loginAdmin);


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
    .route("/section/:id/remove")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .delete(sectionController.deleteFreeSection);

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
    .route("/:language/sectionId/:sectionId/remove/lesson/:lessonSequence")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .delete(lessonController.deleteFreeLesson);

router
    .route("/:language/sectionId/:sectionId/remove/:type/:lessonSequence")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .delete(lessonController.deletePremiumLesson);

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
    .route("/:language/sectionId/:sectionId/lesson/:lessonSequence/exercise/:id")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .patch(exercisesController.updateFreeExercise)
    .delete(exercisesController.deleteFreeExercise);

router
    .route("/add/:language/:type/sectionId/:sectionId/lesson/:lessonSequence/exercise")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(exercisesController.showAddStorymodeExerciseForm)
    .post(upload.array('img[url]', 10), exercisesController.addStorymodeExercise);

router
    .route("/delete/:language/:type/sectionId/:sectionId/lesson/:lessonSequence/storymode-image/:id")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .delete(exercisesController.deleteStorymodeImage);

router
    .route("/add/:language/:type/sectionId/:sectionId/lesson/:lessonSequence/exercise/:id/storymode-image")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .post(upload.single("imgUrl"), exercisesController.uploadImage);


// ** ACOUNT **
router
    .route("/create/account")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(accountController.showAdminRegisterForm)
    .post(accountController.createAdmin);


// ** SHOP ITEMS **
router
    .route("/shop-items")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(shopController.adminShowShopItems);

router
    .route("/shop-items/:itemId")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .patch(shopController.updateShopItem)
    .delete(shopController.deleteShopItem);

router
    .route("/shop-items/add")
    .all(checkUser.requireLogin, checkUser.checkUserType)
    .get(shopController.showAddShopItemForm)
    .post(shopController.addShopItem);


module.exports = router;