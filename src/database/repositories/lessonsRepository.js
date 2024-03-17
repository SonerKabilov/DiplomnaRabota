const { pool } = require("../db-config");

module.exports = {
    queryLessons: async (sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT l.*, s.sequence, s.description
                FROM lessons l
                INNER JOIN sections s
                ON l.sections_id = s.id
                WHERE s.sequence = ?
                ORDER BY l.sequence
            `, [sectionSequence]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
}