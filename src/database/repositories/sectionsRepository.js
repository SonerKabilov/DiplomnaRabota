const { pool } = require("../db-config");

module.exports = {
    queryAllSections: async () => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM sections
                ORDER BY sequence
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryLessons: async (id) => {
        try {
            const [result] = await pool.query(`
                SELECT * FROM lessons l
                INNER JOIN sections s
                ON l.sections_id = s.id
                WHERE s.sequence = ?
                ORDER BY l.sequence`
            , [id]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}