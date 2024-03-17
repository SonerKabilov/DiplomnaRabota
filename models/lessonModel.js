const { pool } = require("../db/database");

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
    queryLessonExercises: async (lessonSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT e.*, o.type AS option_type, t.type AS task_type
                FROM free_exercises e
                INNER JOIN lessons l
                ON e.lessons_id = l.id
                INNER JOIN exercise_option_types o
                ON e.exercise_option_types_id = o.id
                INNER JOIN exercise_task_types t
                ON e.exercise_task_types_id = t.id
                WHERE l.sequence = ?
            `, [lessonSequence]);

            if (result.length > 0) {
                result.forEach((row) => {

                    if (row.options !== null && row.options !== undefined) {
                        row.options = JSON.parse(row.options);
                    }
                });
            }

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}