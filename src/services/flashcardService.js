const flashcardRepository = require('../database/repositories/flashcardRepository');

module.exports = {
    getFlashcardCategories: async (userId) => {
        return await flashcardRepository.queryFlashcardCategories(userId);
    },
    addCategory: async (categoryDetails) => {
        await flashcardRepository.addCategory(categoryDetails);
    },
    updateCategoryTitle: async (categoryDetails) => {
        await flashcardRepository.updateCategoryTitle(categoryDetails);
    },
    deleteCategory: async (categoryId, userId) => {
        await flashcardRepository.deleteCategory(categoryId, userId);
    }
}