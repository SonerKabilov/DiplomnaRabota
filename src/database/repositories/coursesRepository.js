const { pool } = require("../db-config");

module.exports = {
    queryCourses: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM courses
            `);

            return result;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },
    getCourseId: async (language) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM courses
                WHERE language = ?
            `, [language]);

            return result[0].id;
        } catch(err) {
            console.error(err);
            throw err;
        }
    },
    getUserCourses: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT ct.users_id, ct.on_lesson, c.*
                FROM courses_taken ct
                INNER JOIN courses c
                ON ct.courses_id = c.id
                WHERE users_id = ?
            `, [userId]);

            return result;
        } catch(err) {
            console.error(err);
            throw err;
        }
    }
}