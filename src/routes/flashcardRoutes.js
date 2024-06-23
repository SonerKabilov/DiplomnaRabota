const express = require("express");
const router = express.Router();

const flashcardController = require('../controllers/flashcardController');

const checkUser = require('../middlewares/requireLogin');

// FLASHCARD CATEGORIES
router
    .route("/")
    .all(checkUser.requireLogin)
    .get(flashcardController.showFlashcardsPage)
    .post(flashcardController.showFlashcardsPage);

router
    .route("/add/category")
    .all(checkUser.requireLogin)
    .post(flashcardController.addCategory);

router
    .route("/category/:categoryId")
    .all(checkUser.requireLogin)
    .patch(flashcardController.updateCategoryTitle)
    .delete(flashcardController.deleteCategory);


// FLASHCARDS
router
    .route("/add/flashcard/:categoryId")
    .all(checkUser.requireLogin)
    .post(flashcardController.addFlashcard);

router
    .route("/:flashcardId")
    .all(checkUser.requireLogin)
    .patch(flashcardController.updateFlashcard)
    .delete(flashcardController.deleteFlashcard);

router
    .route("/study/:categoryId")
    .all(checkUser.requireLogin)
    .get(flashcardController.studyFlashcards);

router
    .route("/study/:categoryId/low-score")
    .all(checkUser.requireLogin)
    .get(flashcardController.studyFlashcardswithLowScore);

router
    .route("/add/flashcard/:flashcardId/score")
    .all(checkUser.requireLogin)
    .post(flashcardController.addScore);

router
    .route("/recommendation")
    .all(checkUser.requireLogin)
    .get(flashcardController.getFlashcardRecommendations)
    .post(flashcardController.addFlashcardRecommendation);

router
    .route("/accept-recommendation")
    .all(checkUser.requireLogin)
    .post(flashcardController.addRecommendationToFlashcards);

router
    .route("/decline-recommendation")
    .all(checkUser.requireLogin)
    .post(flashcardController.removeRecommendation);

module.exports = router;