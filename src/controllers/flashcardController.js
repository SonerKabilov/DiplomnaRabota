const flashcardService = require('../services/flashcardService');

module.exports = {
    showFlashcardsPage: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;
        const userId = req.session.user_id;
        let { categoryId } = req.body;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const flashcardCategories = await flashcardService.getFlashcardCategories(userId);

        if(categoryId === undefined) {
            categoryId = flashcardCategories[0].id;
        }

        const categoryInformation = await flashcardService.getFlashcardCategoryInfo(categoryId);
        const flashcards = await flashcardService.showFlashcards(categoryId);
        console.log(flashcards);

        res.render("user/flashcardCategories", { userData, language, flashcardCategories, categoryInformation, flashcards });
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
    },
    addFlashcard: async (req, res) => {
        const { categoryId } = req.params;
        const { question, answer } = req.body;

        const flashcardDetails = {
            categoryId,
            question,
            answer
        }

        await flashcardService.addFlashcard(flashcardDetails);

        res.redirect("/flashcards");
    },
    updateFlashcard: async (req, res) => {
        try {
            const { flashcardId } = req.params;
            const { question, answer } = req.body;
            const userId = req.session.user_id;
    
            const flashcardDetails = {
                flashcardId,
                userId,
                question,
                answer
            }
    
            await flashcardService.updateFlashcard(flashcardDetails);
    
            res.redirect("/flashcards");
        } catch (error) {
            console.error(error);
        }

    },
    deleteFlashcard: async (req, res) => {
        const { flashcardId } = req.params;
        const userId = req.session.user_id;

        const flashcardDetails = {
            flashcardId,
            userId
        }

        await flashcardService.deleteFlashcard(flashcardDetails);

        res.redirect("/flashcards");
    }
}