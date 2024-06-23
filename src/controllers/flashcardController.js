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

        if (categoryId === undefined && flashcardCategories.length > 0) {
            categoryId = req.query.categoryId;

            if (categoryId === undefined) {
                categoryId = flashcardCategories[0].id;
            }
        }

        const categoryInformation = await flashcardService.getFlashcardCategoryInfo(categoryId);
        const flashcards = await flashcardService.showFlashcards(categoryId, userId);

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

        res.redirect(`/flashcards`);
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

        res.redirect(`/flashcards?categoryId=${categoryId}`);
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

        res.redirect(`/flashcards?categoryId=${categoryId}`);
    },
    updateFlashcard: async (req, res) => {
        try {
            const { flashcardId } = req.params;
            const { question, answer } = req.body;
            const userId = req.session.user_id;
            const categoryId = req.query.categoryId;

            const flashcardDetails = {
                flashcardId,
                userId,
                question,
                answer
            }

            await flashcardService.updateFlashcard(flashcardDetails);

            res.redirect(`/flashcards?categoryId=${categoryId}`);
        } catch (error) {
            console.error(error);
        }

    },
    deleteFlashcard: async (req, res) => {
        const { flashcardId } = req.params;
        const userId = req.session.user_id;
        const categoryId = req.query.categoryId;

        const flashcardDetails = {
            flashcardId,
            userId
        }

        await flashcardService.deleteFlashcard(flashcardDetails);

        res.redirect(`/flashcards?categoryId=${categoryId}`);
    },
    studyFlashcards: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;
        const userId = req.session.user_id;
        const { categoryId } = req.params;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const flashcards = await flashcardService.showFlashcards(categoryId, userId);

        res.render("user/studyFlashcards", { userData, language, flashcards });
    },
    studyFlashcardswithLowScore: async (req, res) => {
        const userCurrency = req.session.user_currency;
        const coursesTaken = req.session.user_courses;
        const language = req.session.language;
        const userId = req.session.user_id;
        const { categoryId } = req.params;

        const userData = {
            userCurrency,
            coursesTaken
        }

        const flashcards = await flashcardService.showFlashcardsWithLowScore(categoryId, userId);

        res.render("user/studyFlashcards", { userData, language, flashcards });
    },
    addScore: async (req, res) => {
        const { score } = req.body;
        const { flashcardId } = req.params;
        const userId = req.session.user_id;

        const flashcardDetails = {
            score,
            flashcardId,
            userId
        }

        try {
            await flashcardService.addScore(flashcardDetails);

            res.status(200).send({ success: true, msg: `Успешно оценена флашкарта: ${score}` });
        } catch(error) {
            console.log(error);
        }
    },
    addFlashcardRecommendation: async (req, res) => {
        const { question, answer } = req.body;
        const userId = req.session.user_id;

        const flashcard = {
            question: question,
            answer: answer,
            userId: userId
        }

        try {
            await flashcardService.addFlashcardRecommendation(flashcard);
            res.status(200).send({ success: true });
        } catch (err) {
            console.log(err);
        }
    },
    getFlashcardRecommendations: async (req, res) => {
        const userId = req.session.user_id;

        try {
            const flashcards = await flashcardService.getFlashcardRecommendations(userId);

            res.json(flashcards);
        } catch (err) {
            console.log(err);
        }
    },
    addRecommendationToFlashcards: async (req, res) => {
        const { categoryId, flashcardId, question, answer } = req.body;

        const flashcardDetails = {
            categoryId,
            question,
            answer
        }

        try {
            await flashcardService.addFlashcard(flashcardDetails);
            await flashcardService.removeFlashcardRecommendation(flashcardId);
            res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(400).send({ success: false });
        }
    },
    removeRecommendation: async (req, res) => {
        const { flashcardId } = req.body;

        try {
            await flashcardService.removeFlashcardRecommendation(flashcardId);
            res.status(200).send({ success: true });
        } catch (error) {
            console.log(error);
            res.status(400).send({ success: false });
        }
    }
}