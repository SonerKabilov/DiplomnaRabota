const express = require("express");
const router = express.Router();
const sectionController = require('../controllers/sectionsController');

router.get('/:sectionSequence/lessons', sectionController.getLessons);


module.exports = router;