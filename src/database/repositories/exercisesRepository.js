const { pool } = require("../db-config");

module.exports = {
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
    },
    insertExercise: async (exerciseToInsert) => {
        try {
            await pool.query(`
                INSERT INTO free_exercises (task, options, correct_answer, lessons_id, exercise_task_types_id, exercise_option_types_id)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [exerciseToInsert.task, 
                exerciseToInsert.options, 
                exerciseToInsert.correctAnswer, 
                exerciseToInsert.exerciseLessonId, 
                exerciseToInsert.taskTypesId, 
                exerciseToInsert.optionTypesId
            ]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}