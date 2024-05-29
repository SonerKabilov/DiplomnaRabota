const { pool } = require("../db-config");

module.exports = {
    queryLessons: async (language, sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT l.id, l.preview, l.sequence
                FROM free_lessons l
                INNER JOIN free_sections s
                ON l.sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE s.sequence = ? AND c.language = ?
                ORDER BY l.sequence
            `, [sectionSequence, language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPremiumLessons: async (language, type) => {
        try {
            const [result] = await pool.query(`
                SELECT l.id, l.sequence
                FROM premium_lessons l
                INNER JOIN premium_sections s
                ON l.premium_sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                INNER JOIN premium_section_types pt
                ON s.premium_section_types_id = pt.id
                WHERE pt.type = ? AND c.language = ?
                ORDER BY l.sequence
            `, [type, language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryLessonsForUser: async (language) => {
        try {
            const [result] = await pool.query(`
                SELECT l.id, l.preview, l.sequence, l.sections_id, s.sequence AS section_sequence
                FROM free_lessons l
                INNER JOIN free_sections s
                ON l.sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE c.language = ?
                ORDER BY l.sequence
            `, [language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryLastLessonSequence: async (courseId) => {
        try {
            const [result] = await pool.query(`
                SELECT l.sequence
                FROM free_lessons l
                INNER JOIN free_sections s
                ON l.sections_id = s.id
                WHERE s.courses_id = ?
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
    queryLastPremiumLessonSequence: async (courseId, type) => {
        try {
            const [result] = await pool.query(`
                SELECT l.sequence
                FROM premium_lessons l
                INNER JOIN premium_sections s
                ON l.premium_sections_id = s.id
                INNER JOIN premium_section_types pt
                ON s.premium_section_types_id = pt.id
                WHERE s.courses_id = ? AND pt.type = ?
                ORDER BY sequence DESC
                LIMIT 1
            `, [courseId, type]);

            if(result.length === 0) {
                return 0;
            }

            return result[0].sequence;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLessonId: async (sequence, sectionId) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM free_lessons
                WHERE sequence = ? AND sections_id = ?
            `, [sequence, sectionId]);

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
                INSERT INTO free_lessons (sequence, sections_id)
                VALUES (?, ?)
            `, [lessonToInsert.sequence, lessonToInsert.section_id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertPremiumLesson: async (lessonToInsert) => {
        try {
            await pool.query(`
                INSERT INTO premium_lessons (sequence, premium_sections_id)
                VALUES (?, ?)
            `, [lessonToInsert.sequence, lessonToInsert.section_id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLessonPreview: async(lessonSequence, sectionId) => {
        try {
            const [result] = await pool.query(`
                SELECT preview
                FROM free_lessons
                WHERE sequence = ? AND sections_id = ?
            `, [lessonSequence, sectionId]);

            if(result.length === 0) {
                return;
            }
            
            return result[0].preview;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateLessonPreview: async(lessonToUpdate) => {
        try {
            await pool.query(`
                UPDATE free_lessons
                SET preview = ?
                WHERE sequence = ? AND sections_id = ?
            `, [lessonToUpdate.lessonPreview, lessonToUpdate.lessonSequence, lessonToUpdate.sectionId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}