const express = require("express");
const router = express.Router();

const accountController = require('../controllers/accountController');

// ** LOGIN **
router
    .route("/login")
    .get(accountController.showLoginForm)
    .post;


// ** REGISTER **
router
    .route("/register")
    .get(accountController.showUserRegisterForm)
    .post(accountController.createUser);


// ** LOGOUT **

module.exports = router;