const express = require("express");
const router = express.Router();

const coursesController = require('../controllers/coursesController');
const checkUser = require('../middlewares/requireLogin');

router
    .route("/add")
    .all(checkUser.requireLogin)
    .get(coursesController.showAvailableCourses)
    .post(coursesController.addCourseForUser);


module.exports = router;