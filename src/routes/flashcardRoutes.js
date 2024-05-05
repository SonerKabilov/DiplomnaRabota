const express = require("express");
const router = express.Router();

const flashcardController = require('../controllers/flashcardController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/")
    .all(checkUser.requireLogin)
    .get(flashcardController.showFlashcardsPage);

router
    .route("/add/category")
    .all(checkUser.requireLogin)
    .post(flashcardController.addCategory);

router
    .route("/update/category/:categoryId")
    .all(checkUser.requireLogin)
    .patch(flashcardController.updateCategoryTitle);

router
    .route("/delete/category/:categoryId")
    .all(checkUser.requireLogin)
    .delete(flashcardController.deleteCategory);

module.exports = router;