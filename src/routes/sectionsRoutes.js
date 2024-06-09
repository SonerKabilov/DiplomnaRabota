const express = require("express");
const router = express.Router();

const sectionController = require('../controllers/sectionsController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/:language/free/lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.showFreeSectionsPage);

router
    .route("/:language/get-free-sections-and-lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.getFreeSectionsAndLessons);

router
    .route("/:language/premium/lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.showPremiumSectionsPage);

router
    .route("/:language/get-premium-sections-and-lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.getPremiumSectionsAndLessons);


module.exports = router;