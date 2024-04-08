const express = require("express");
const router = express.Router();

const sectionController = require('../controllers/sectionsController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/:sectionSequence/:language/lessons")
    .all(checkUser.requireLogin)
    .get(sectionController.getLessons);


module.exports = router;