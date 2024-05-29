const express = require("express");
const router = express.Router();

const sectionController = require('../controllers/sectionsController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/:language/free/lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.getFreeSections);

router
    .route("/:language/premium/lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.getPremiumSections);


module.exports = router;