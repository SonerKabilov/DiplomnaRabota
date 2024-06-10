const express = require("express");
const router = express.Router();

const shopController = require('../controllers/shopController');

const checkUser = require('../middlewares/requireLogin');

router
    .route("/")
    .all(checkUser.requireLogin)
    .get(shopController.showShopPage);

router
    .route("/create-checkout-session")
    .all(checkUser.requireLogin)
    .post(shopController.makePayment);

router
    .route("/item/:id/payment")
    .all(checkUser.requireLogin)
    .get(shopController.showStripeForm);

router
    .route("/coins-purchase")
    .all(checkUser.requireLogin)
    .post(shopController.coinsPurchase);

router
    .route("/purchase-history")
    .all(checkUser.requireLogin)
    .get(shopController.showPurchaseHisory);

module.exports = router;