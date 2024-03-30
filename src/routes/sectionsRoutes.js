const express = require("express");
const router = express.Router();
const sectionController = require('../controllers/sectionsController');

router
    .route("/:sectionSequence/course/:courseId/lessons")
    .get(sectionController.getLessons);

module.exports = router;