const { pool } = require("../db-config");

module.exports = {
    queryAllSections: async () => {
        try {
            const [result] = await pool.query(`
                SELECT s.*, c.language
                FROM sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                ORDER BY sequence
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    querySectionId: async (sectionDetails) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM sections
                WHERE sequence = ? AND courses_id = ?
            `, [sectionDetails.sectionSequence, sectionDetails.courseId]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLastSectionSequence: async (courseId) => {
        try {
            const [result] = await pool.query(`
                SELECT sequence
                FROM sections
                WHERE courses_id = ?
                ORDER BY sequence DESC
                LIMIT 1
            `, [courseId]);

            if(result.length === 0) {
                return 0;
            }

            return result[0].sequence;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getSectionDescription: async (language, sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT s.id, s.description, c.language
                FROM sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE s.sequence = ? AND c.language = ?
            `, [sectionSequence, language]);

            return result[0];
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
    },
    updateSectionDescription: async (sectionToUpdate) => {
        try {
            await pool.query(`
                UPDATE sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                SET s.description = ?
                WHERE s.sequence = ? AND c.language = ?
            `, [sectionToUpdate.description, sectionToUpdate.sequence, sectionToUpdate.language]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}