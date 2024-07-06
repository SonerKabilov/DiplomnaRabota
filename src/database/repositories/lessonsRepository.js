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
                WHERE s.sequence = ? AND c.language = ? AND l.is_deleted = 0
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
                WHERE pt.type = ? AND c.language = ? AND l.is_deleted = 0
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
                WHERE c.language = ? AND l.is_deleted = 0
                ORDER BY l.sequence
            `, [language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPremiumLessonsForUser: async (language) => {
        try {
            const [result] = await pool.query(`
                SELECT l.premium_sections_id, l.sequence, st.type
                FROM premium_lessons l
                INNER JOIN premium_sections s
                ON l.premium_sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                INNER JOIN premium_section_types st
                ON s.premium_section_types_id = st.id
                WHERE c.language = ? AND l.is_deleted = 0
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

            if (result.length === 0) {
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

            if (result.length === 0) {
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

            if (result.length === 0) {
                return 0;
            }

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getLessonIdByLanguage: async (sequence, language) => {
        try {
            const [result] = await pool.query(`
                SELECT l.id
                FROM free_lessons l
                INNER JOIN free_sections s
                ON l.sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE l.sequence = ? AND c.language = ?
            `, [sequence, language]);

            if (result.length === 0) {
                return 0;
            }

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getPremiumLessonId: async (sequence, sectionId) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM premium_lessons
                WHERE sequence = ? AND premium_sections_id = ?
            `, [sequence, sectionId]);

            if (result.length === 0) {
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
    getLessonPreview: async (lessonSequence, sectionId) => {
        try {
            const [result] = await pool.query(`
                SELECT preview
                FROM free_lessons
                WHERE sequence = ? AND sections_id = ?
            `, [lessonSequence, sectionId]);

            if (result.length === 0) {
                return;
            }

            return result[0].preview;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateLessonPreview: async (lessonToUpdate) => {
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
    },
    updateFreeLessonDeleteStatus: async (sectionId, lessonSequence, language) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(`
                UPDATE free_lessons
                SET is_deleted = 1, sequence = 0
                WHERE sequence = ? AND sections_id = ?
            `, [lessonSequence, sectionId]);

            await connection.query(`
                UPDATE free_lessons l
                INNER JOIN free_sections s
                ON l.sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                SET l.sequence = l.sequence - 1
                WHERE l.sequence > ? AND c.language = ? AND l.is_deleted = 0
            `, [lessonSequence, language]);

            await connection.query(`
                UPDATE courses_taken ct
                INNER JOIN courses c
                ON ct.courses_id = c.id
                SET ct.on_lesson = ct.on_lesson - 1
                WHERE ct.on_lesson >= ? AND c.language = ? AND ct.on_lesson > 1;
            `, [lessonSequence, language]);

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }
    },
    updateStorymodeLessonDeleteStatus: async (sectionId, lessonSequence, language) => {
        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(`
                UPDATE premium_lessons
                SET is_deleted = 1, sequence = 0
                WHERE sequence = ? AND premium_sections_id = ?
            `, [lessonSequence, sectionId]);

            await connection.query(`
                UPDATE premium_lessons l
                INNER JOIN premium_sections s
                ON l.premium_sections_id = s.id
                INNER JOIN courses c
                ON s.courses_id = c.id
                SET l.sequence = l.sequence - 1
                WHERE l.sequence > ? AND c.language = ? AND l.is_deleted = 0
            `, [lessonSequence, language]);

            await connection.query(`
                UPDATE courses_taken ct
                INNER JOIN courses c
                ON ct.courses_id = c.id
                SET ct.on_storymode_lesson = ct.on_storymode_lesson - 1
                WHERE ct.on_storymode_lesson >= ? AND c.language = ? AND ct.on_storymode_lesson > 1;
            `, [lessonSequence, language]);

            await connection.commit();
        } catch (err) {
            await connection.rollback();
            console.error(err);
            throw err;
        } finally {
            connection.release();
        }
    },
    hasEfficiency: async (lessonId, userId) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM lesson_efficiency
                WHERE lessons_id = ? AND users_id = ?
            `, [lessonId, userId]);

            if (result.length === 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    addEfficiency: async (efficiency, lessonId, userId) => {
        try {
            await pool.query(`
                INSERT INTO lesson_efficiency (efficiency, users_id, lessons_id)
                VALUES (?, ?, ?)
            `, [efficiency, userId, lessonId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateEfficiency: async (efficiency, lessonId, userId) => {
        try {
            await pool.query(`
                UPDATE lesson_efficiency
                SET efficiency = ?
                WHERE users_id = ? AND lessons_id = ?
            `, [efficiency, userId, lessonId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    selectLessonEficiency: async (lessonId, userId) => {
        try {
            const [result] = await pool.query(`
                SELECT efficiency
                FROM lesson_efficiency
                WHERE lessons_id = ? AND users_id = ?
            `, [lessonId, userId]);

            if (result.length > 0) {
                return result[0].efficiency;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}