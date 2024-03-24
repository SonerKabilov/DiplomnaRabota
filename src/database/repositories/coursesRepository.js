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
    }
}