const express = require("express");
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get("/", adminController.showAdminPage);
router.get("/add/lesson", adminController.showAddLessonForm);
router.post("/add/lesson", adminController.addLesson);

module.exports = router;