module.exports = {
    showShopPage: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;

        const userData = {
            userCurrency,
            coursesTaken
        }

        res.render("user/shop", { userData, language });
    }
}