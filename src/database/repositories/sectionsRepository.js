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
    },
    getLastSectionSequence: async () => {
        try {
            const [result] = await pool.query(`
                SELECT sequence
                FROM sections
                ORDER BY sequence DESC
                LIMIT 1
            `);

            if(result.length === 0) {
                return 0;
            }

            return result[0].sequence;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getSectionDescription: async (sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT description
                FROM sections
                WHERE sequence = ?
            `, [sectionSequence]);

            return result[0].description;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertSection: async (sectionToInsert) => {
        try {
            await pool.query(`
                INSERT INTO sections (sequence, description, section_types_id, courses_id)
                VALUES (?, ?, ?, ?)
            `, [sectionToInsert.sequence, sectionToInsert.description, sectionToInsert.sectionType, sectionToInsert.courseId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}