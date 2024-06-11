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
    queryFlashcardCategory: async (categoryId) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM flashcard_categories
                WHERE id = ?
        `, [categoryId]);

            return result[0];
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
    },
    queryFlashcards: async (categoryId, userId) => {
        try {
            const [result] = await pool.query(`
                SELECT f.*
                FROM flashcards f
                INNER JOIN flashcard_categories fc
                ON f.flashcard_categories_id = fc.id
                WHERE f.flashcard_categories_id = ? AND fc.users_id = ?
        `, [categoryId, userId]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    addFlashcard: async (flashcardDetails) => {
        try {
            await pool.query(`
                INSERT INTO flashcards (question, answer, flashcard_categories_id)
                VALUES (?, ?, ?)
        `, [flashcardDetails.question, flashcardDetails.answer, flashcardDetails.categoryId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateFlashcard: async (flashcardDetails) => {
        try {
            await pool.query(`
                UPDATE flashcards f
                INNER JOIN flashcard_categories fc
                ON f.flashcard_categories_id = fc.id
                SET f.question = ?, f.answer = ?
                WHERE f.id = ? AND fc.users_id = ?
        `, [flashcardDetails.question, flashcardDetails.answer, flashcardDetails.flashcardId, flashcardDetails.userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    deleteFlashcard: async (flashcardDetails) => {
        try {
            await pool.query(`
                DELETE f
                FROM flashcards f
                INNER JOIN flashcard_categories fc
                ON f.flashcard_categories_id = fc.id
                WHERE f.id = ? AND fc.users_id = ?
            `, [flashcardDetails.flashcardId, flashcardDetails.userId])
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateFlashcardScore: async (flashcardDetails) => {
        try {
            await pool.query(`
                UPDATE flashcards f
                INNER JOIN flashcard_categories fc
                ON f.flashcard_categories_id = fc.id
                SET f.score = ?
                WHERE f.id = ? AND fc.users_id = ?
            `, [flashcardDetails.score, flashcardDetails.flashcardId, flashcardDetails.userId])
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertFlashcardRecommendation: async (flashcard) => {
        try {
            await pool.query(`
                INSERT INTO flashcard_recommendations (question, answer, users_id)
                VALUES (?, ?, ?)
            `, [flashcard.question, flashcard.answer, flashcard.userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getFlashcardRecommendation: async (flashcard) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM flashcard_recommendations
                WHERE question = ? AND answer = ? AND users_id = ?
            `, [flashcard.question, flashcard.answer, flashcard.userId]);

            if (result.length > 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryFlashcardRecommendations: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM flashcard_recommendations
                WHERE users_id = ?
            `, [userId]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    deleteFlashcardRecommendation: async (flashcardId) => {
        try {
            await pool.query(`
                DELETE
                FROM flashcard_recommendations
                WHERE id = ?
            `, [flashcardId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}