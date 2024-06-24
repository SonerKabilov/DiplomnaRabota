const { pool } = require("../db-config");

module.exports = {
    queryAllSections: async () => {
        try {
            const [result] = await pool.query(`
                SELECT s.*, c.language
                FROM free_sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE s.is_deleted = '0'
                ORDER BY sequence
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryAllPremiumSections: async () => {
        try {
            const [result] = await pool.query(`
                SELECT ps.courses_id, pt.type, pt.section_type_bulgarian, c.language
                FROM premium_sections ps
                INNER JOIN courses c
                ON ps.courses_id = c.id
                INNER JOIN premium_section_types pt
                ON ps.premium_section_types_id = pt.id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    querySectionsForCourse: async (language) => {
        try {
            const [result] = await pool.query(`
                SELECT s.*, c.language
                FROM free_sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE c.language = ? AND s.is_deleted = '0'
                ORDER BY sequence
            `, [language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPremiumSectionsForCourse: async (language) => {
        try {
            const [result] = await pool.query(`
                SELECT ps.id, ps.description, pt.type, pt.section_type_bulgarian, c.language
                FROM premium_sections ps
                INNER JOIN courses c
                ON ps.courses_id = c.id
                INNER JOIN premium_section_types pt
                ON ps.premium_section_types_id = pt.id
                WHERE c.language = ?
            `, [language]);

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
                FROM free_sections
                WHERE sequence = ? AND courses_id = ?
            `, [sectionDetails.sectionSequence, sectionDetails.courseId]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    querySectionIdByLanguage: async (sectionDetails) => {
        try {
            const [result] = await pool.query(`
                SELECT s.id
                FROM free_sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                WHERE s.sequence = ? AND c.language = ?
            `, [sectionDetails.sectionSequence, sectionDetails.language]);

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
                FROM free_sections
                WHERE courses_id = ?
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
    getSectionData: async (language, sectionSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT s.id, s.description, c.language
                FROM free_sections s
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
                INSERT INTO free_sections (sequence, description, courses_id)
                VALUES (?, ?, ?)
            `, [sectionToInsert.sequence, sectionToInsert.description, sectionToInsert.courseId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateSectionDescription: async (sectionToUpdate) => {
        try {
            await pool.query(`
                UPDATE free_sections s
                INNER JOIN courses c
                ON s.courses_id = c.id
                SET s.description = ?
                WHERE s.sequence = ? AND c.language = ?
            `, [sectionToUpdate.description, sectionToUpdate.sequence, sectionToUpdate.language]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getPremiumSectionTypeId: async (sectionType) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM premium_section_types
                WHERE type = ?
            `, [sectionType]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    checkIfPremiumSectionExists: async (sectionTypeId, courseId) => {
        try {
            const [result] = await pool.query(`
                SELECT id
                FROM premium_sections
                WHERE premium_section_types_id = ? AND courses_id = ?
            `, [sectionTypeId, courseId]);

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertPremiumSection: async (sectionToInsert) => {
        try {
            await pool.query(`
                INSERT INTO premium_sections (description, premium_section_types_id, courses_id)
                VALUES (?, ?, ?)
            `, [sectionToInsert.description, sectionToInsert.premiumSectionTypeId, sectionToInsert.courseId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getPremiumSectionData: async (language, type) => {
        try {
            const [result] = await pool.query(`
                SELECT ps.id, ps.description, pt.type, c.language
                FROM premium_sections ps
                INNER JOIN premium_section_types pt
                ON ps.premium_section_types_id = pt.id
                INNER JOIN courses c
                ON ps.courses_id = c.id
                WHERE pt.type = ? AND c.language = ?
            `, [type, language]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPremiumSectionId: async (sectionDetails) => {
        try {
            const [result] = await pool.query(`
                SELECT ps.id
                FROM premium_sections ps
                INNER JOIN premium_section_types pt
                ON ps.premium_section_types_id = pt.id
                WHERE pt.type = ? AND ps.courses_id = ?
            `, [sectionDetails.type, sectionDetails.courseId]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPremiumSectionIdByLanguage: async (sectionDetails) => {
        try {
            const [result] = await pool.query(`
                SELECT ps.id
                FROM premium_sections ps
                INNER JOIN premium_section_types pt
                ON ps.premium_section_types_id = pt.id
                INNER JOIN courses c
                ON ps.courses_id = c.id
                WHERE pt.type = ? AND c.language = ?
            `, [sectionDetails.type, sectionDetails.language]);

            return result[0].id;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateFreeSectionDeleteStatus: async (id) => {
        try {
            const [result] = await pool.query(`
                    SELECT sequence, courses_id
                    FROM free_sections
                    WHERE id = ?
                `, [id]);

            if (result.length > 0) {
                const sequence = result[0].sequence;
                const courseId = result[0].courses_id;

                await pool.query(`
                    UPDATE free_sections
                    SET is_deleted = 1, sequence = 0
                    WHERE id = ?
                `, [id]);

                await pool.query(`
                    UPDATE free_sections
                    SET sequence = sequence - 1
                    WHERE sequence > ? AND courses_id = ? AND is_deleted = 0
                `, [sequence, courseId]);
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    checkIfSectionHasLessons: async (id) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM free_lessons
                WHERE sections_id = ? AND is_deleted = 0
            `, [id]);

            if (result.length > 0) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}