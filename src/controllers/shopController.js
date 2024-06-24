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

        try {
            const shopItems = await shopService.getShopItems();

            res.render("user/shop", { userData, language, shopItems });
        } catch (error) {
            console.log(error);

            req.flash("error", "Страницата не съществува!");
            res.redirect(`/${language}/free/lessons`);
        }
    },
    makePayment: async (req, res) => {
        const { payment_method_id, itemId } = req.body;
        const userId = req.session.user_id;

        const productData = await shopService.getItemForPurchasing(itemId);

        try {
            // Create payment intent or checkout session using the payment method ID
            const paymentIntent = await stripe.paymentIntents.create({
                payment_method: payment_method_id, // Payment type -> credit card
                amount: productData[0].cost * 100,
                currency: 'bgn',
                confirm: true,
                return_url: 'http://localhost:3000/shop'
            });

            if (paymentIntent.status === 'succeeded') {
                if (productData[0].item_type === "coins") {
                    await accountService.updateCurrency(productData[0].quantity, userId);

                    await shopService.addPaymentHistory(itemId, userId);

                    const currency = await accountService.getUserCurrency(userId);

                    req.session.user_currency = currency;

                    req.flash("success", "Успешно извършена покупка!");

                    res.status(200).json({ success: true });
                } else if (productData[0].item_type === "membership") {
                    const membership = await accountService.updateMembership(userId, productData[0].quantity, '');

                    if (!membership) {
                        req.flash("error", "Имате активен абонамент!");

                        res.status(400).json({ error: 'Имате активен абонамент' });
                    } else {
                        await shopService.addPaymentHistory(itemId, userId);

                        req.flash("success", "Успешно закупен абонамент!");

                        res.status(200).json({ success: true });
                    }
                }
            } else {
                req.flash("error", "Грешка при извършване на покупката!");
                res.status(400).json({ error: 'Грешка при извършване на покупката' });
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            req.flash("error", "Грешка при извършване на покупката!");
            res.status(400).json({ error: 'Грешка при извършване на покупката' });
        }
    },
    showStripeForm: async (req, res) => {
        const { id } = req.params;
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;

        try {
            let shopItem = await shopService.getItemForPurchasing(id);
            shopItem = shopItem[0];

            const userData = {
                userCurrency,
                coursesTaken
            }

            res.render("user/stripe", { userData, language, shopItem });
        } catch (error) {
            console.log(error);

            req.flash("error", "Страницата не съществува!");
            res.redirect("/shop");
        }
    },
    coinsPurchase: async (req, res) => {
        const { itemId } = req.body;
        const userId = req.session.user_id;

        const shopItem = await shopService.getItemForPurchasing(itemId);

        if (shopItem[0].item_type === "membership") {
            try {
                const membership = await accountService.updateMembership(userId, shopItem[0].quantity, shopItem[0].cost);

                if (!membership) {
                    req.flash("error", "Нямате достатъчно монети или имате активен абонамент!");
                } else {
                    req.flash("success", "Успешно закупен абонамент!");

                    await shopService.addPaymentHistory(itemId, userId);

                    const currency = await accountService.getUserCurrency(userId);

                    req.session.user_currency = currency;
                }
            } catch (error) {
                console.log(error);
                req.flash("error", "Грешка при закупуване на абонамент!");
            }
        }

        res.json({ success: true });
    },
    adminShowShopItems: async (req, res) => {
        const shopItems = await shopService.getShopItems();
        const paymentTypes = await shopService.getPaymentTypes();
        const userType = req.session.user_type;

        res.render("admin/showShopItems", { shopItems, paymentTypes, userType });
    },
    updateShopItem: async (req, res) => {
        const { itemId } = req.params;
        const body = req.body;

        const shopItem = {
            id: itemId,
            quantity: body.quantity,
            cost: body.cost,
            paymentType: body.paymentTypes
        }

        try {
            await shopService.updateShopItem(shopItem);

            req.flash("success", "Успешно редактиране на продукт!");
            res.redirect("/admin/shop-items");
        } catch {
            req.flash("error", "Грешка при редактиране на продукт!");
            res.redirect("/admin/shop-items");
        }
    },
    deleteShopItem: async (req, res) => {
        const { itemId } = req.params;

        try {
            await shopService.deleteShopItem(itemId);

            req.flash("success", "Успешно изтрит продукт!");
            res.redirect("/admin/shop-items");
        } catch {
            req.flash("error", "Неуспешно изтрит продукт!");
            res.redirect("/admin/shop-items");
        }
    },
    showAddShopItemForm: async (req, res) => {
        const paymentTypes = await shopService.getPaymentTypes();
        const itemTypes = await shopService.getShopItemTypes();
        const userType = req.session.user_type;

        res.render("admin/addShopItemForm", { paymentTypes, itemTypes, userType });
    },
    addShopItem: async (req, res) => {
        const body = req.body;

        const shopItem = {
            quantity: body.quantity,
            cost: body.cost,
            itemType: body.itemTypes,
            paymentType: body.paymentTypes
        }

        try {
            await shopService.addShopItem(shopItem);

            req.flash("success", "Успешно добавен продукт!");
            res.redirect("/admin/shop-items");
        } catch {
            req.flash("error", "Грешка при добавяне на продукт!");
            res.redirect("/admin/shop-items/add");
        }
    },
    showPurchaseHisory: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;
        const userId = req.session.user_id;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const purchaseHistory = await shopService.getPurchaseHistory(userId);
        const membership = await accountService.getMembership(userId);

        res.render("user/purchaseHistory", { userData, language, purchaseHistory, membership });
    }
}