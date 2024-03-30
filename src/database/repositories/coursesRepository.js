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
    }
}