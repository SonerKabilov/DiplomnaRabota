const { pool } = require("../db-config");

module.exports = {
    queryFlashcardCategories: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM flashcard_categories
                WHERE users_id = ?
        `, [userId]);

            return result
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    addCategory: async (categoryDetails) => {
        const title = categoryDetails.categoryTitle || "Нова категория";

        try {
            await pool.query(`
                INSERT INTO flashcard_categories (title, users_id)
                VALUES (?, ?)
        `, [title, categoryDetails.userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateCategoryTitle: async (categoryDetails) => {
        try {
            await pool.query(`
                UPDATE flashcard_categories
                SET title = ?
                WHERE id = ? AND users_id = ?
        `, [categoryDetails.categoryTitle, categoryDetails.categoryId, categoryDetails.userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    deleteCategory: async (categoryId, userId) => {
        try {
            await pool.query(`
                DELETE
                FROM flashcard_categories
                WHERE id = ? AND users_id = ?
            `, [categoryId, userId])
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}