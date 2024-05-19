const flashcardRepository = require('../database/repositories/flashcardRepository');

module.exports = {
    getFlashcardCategories: async (userId) => {
        return await flashcardRepository.queryFlashcardCategories(userId);
    },
    getFlashcardCategoryInfo: async (categoryId) => {
        return await flashcardRepository.queryFlashcardCategory(categoryId);
    },
    addCategory: async (categoryDetails) => {
        await flashcardRepository.addCategory(categoryDetails);
    },
    updateCategoryTitle: async (categoryDetails) => {
        await flashcardRepository.updateCategoryTitle(categoryDetails);
    },
    deleteCategory: async (categoryId, userId) => {
        await flashcardRepository.deleteCategory(categoryId, userId);
    },
    showFlashcards: async (categoryId, userId) => {
        return await flashcardRepository.queryFlashcards(categoryId, userId);
    },
    addFlashcard: async (flashcardDetails) => {
        await flashcardRepository.addFlashcard(flashcardDetails);
    },
    updateFlashcard: async (flashcardDetails) => {
        await flashcardRepository.updateFlashcard(flashcardDetails);
    },
    deleteFlashcard: async (flashcardDetails) => {
        await flashcardRepository.deleteFlashcard(flashcardDetails);
    },
    addScore: async (flashcardDetails) => {
        if(flashcardDetails.score >= 1 && flashcardDetails.score <= 5) {
            await flashcardRepository.updateFlashcardScore(flashcardDetails);
        }
    }
}