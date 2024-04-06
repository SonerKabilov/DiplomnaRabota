const express = require("express");
const router = express.Router();

const accountController = require('../controllers/accountController');

const checkUser = require('../middlewares/requireLogin');

// ** LOGIN **
router
    .route("/login")
    .all(checkUser.checkIfUserIsLogged)
    .get(accountController.showLoginForm)
    .post(accountController.loginUser);


// ** REGISTER **
router
    .route("/register")
    .all(checkUser.checkIfUserIsLogged)
    .get(accountController.showUserRegisterForm)
    .post(accountController.createUser);


// ** LOGOUT **
router
    .route("/logout")
    .post(accountController.logoutUser);


module.exports = router;