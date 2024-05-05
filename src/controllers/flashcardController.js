const flashcardService = require('../services/flashcardService');

module.exports = {
    showFlashcardsPage: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;
        const userId = req.session.user_id;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const flashcardCategories = await flashcardService.getFlashcardCategories(userId);

        res.render("user/flashcardCategories", { userData, language, flashcardCategories });
    },
    addCategory: async (req, res) => {
        const { categoryTitle } = req.body;
        const userId = req.session.user_id;

        const categoryDetails = {
            categoryTitle,
            userId
        }

        await flashcardService.addCategory(categoryDetails);

        res.redirect("/flashcards");
    },
    updateCategoryTitle: async (req, res) => {
        const { categoryId } = req.params;
        const { categoryTitle } = req.body;
        const userId = req.session.user_id;

        const categoryDetails = {
            categoryId,
            categoryTitle,
            userId
        }

        await flashcardService.updateCategoryTitle(categoryDetails);

        res.redirect("/flashcards");
    },
    deleteCategory: async (req, res) => {
        const { categoryId } = req.params;
        const userId = req.session.user_id;

        await flashcardService.deleteCategory(categoryId, userId);

        res.redirect("/flashcards");
    }
}