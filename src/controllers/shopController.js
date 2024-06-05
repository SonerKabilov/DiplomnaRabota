const shopService = require('../services/shopService');
const accountService = require('../services/accountService');

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

module.exports = {
    showShopPage: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const shopItems = await shopService.getShopItems();

        res.render("user/shop", { userData, language, shopItems });
    },
    makePayment: async (req, res) => {
        const { payment_method_id, itemId } = req.body;
        const productData = await shopService.getItemForPurchasing(itemId);

        try {
            // Create payment intent or checkout session using the payment method ID
            await stripe.paymentIntents.create({
                payment_method: payment_method_id, // Payment type -> credit card
                amount: productData[0].cost * 100,
                currency: 'bgn',
                confirm: true,
                return_url: 'http://localhost:3000/shop'
            });

        } catch (error) {
            console.error('Error processing payment:', error);
            res.status(500).json({ error: 'Payment processing failed' });
        } finally {
            const userId = req.session.user_id;

            await accountService.updateCurrency(productData[0].quantity, userId);

            const currency = accountService.getUserCurrency(userId);

            req.session.user_currency = currency;

            res.status(200).json({ success: true });
        }
    },
    showStripeForm: async (req, res) => {
        const { id } = req.params;
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;

        let shopItem = await shopService.getItemForPurchasing(id);
        shopItem = shopItem[0];

        const userData = {
            userCurrency,
            coursesTaken
        }

        res.render("user/stripe", { userData, language, shopItem });
    }
}