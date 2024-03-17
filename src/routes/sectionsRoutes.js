const express = require("express");
const router = express.Router();
const sectionController = require('../controllers/sectionsController');

router.get('/:id/lessons', sectionController.getLessons);


module.exports = router;