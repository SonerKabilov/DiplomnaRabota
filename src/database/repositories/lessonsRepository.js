const { pool } = require("../db-config");

module.exports = {
    queryLessons: async (sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT l.*, s.sequence AS section_sequence, s.description
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
    queryLastLessonSequence: async () => {
        try {
            const [result] = await pool.query(`
                SELECT sequence
                FROM lessons
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
    getLessonId: async (sequence) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM lessons
                WHERE sequence = ?
            `, [sequence]);

            if(result.length === 0) {
                return 0;
            }

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertLesson: async (lessonToInsert) => {
        try {
            await pool.query(`
                INSERT INTO lessons (sequence, sections_id)
                VALUES (?, ?)
            `, [lessonToInsert.sequence, lessonToInsert.section_id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLessonPreview: async(lessonSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT preview
                FROM lessons
                WHERE sequence = ?
            `, [lessonSequence]);

            return result[0].preview;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}