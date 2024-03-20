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
    querySectionId: async (sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM sections
                WHERE sequence = ?
            `, [sectionSequence]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}