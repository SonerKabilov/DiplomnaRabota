const express = require("express");
const router = express.Router();

const shopController = require('../controllers/shopController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/")
    .all(checkUser.requireLogin)
    .get(shopController.showShopPage);


module.exports = router;