const { pool } = require("../db-config");

module.exports = {
    queryLessonExercises: async (sectionId, lessonSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT e.*, o.type AS option_type, t.type AS task_type
                FROM free_exercises e
                INNER JOIN free_lessons l
                ON e.lessons_id = l.id
                INNER JOIN exercise_option_types o
                ON e.exercise_option_types_id = o.id
                INNER JOIN exercise_task_types t
                ON e.exercise_task_types_id = t.id
                WHERE l.sequence = ? AND l.sections_id = ? AND e.is_deleted = '0'
            `, [lessonSequence, sectionId]);

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
    queryCorrectAnswer: async (exerciseId) => {
        try {
            const [result] = await pool.query(`
                SELECT correct_answer
                FROM free_exercises
                WHERE id = ?
            `, [exerciseId]);

            return result[0].correct_answer;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
    queryStorymodeExercise: async (sectionId, lessonSequence) => {
        try {
            const [result] = await pool.query(`
                SELECT s.id, s.task
                FROM storymode_exercises s
                INNER JOIN premium_lessons pl
                ON s.premium_lessons_id = pl.id
                WHERE pl.sequence = ? AND pl.premium_sections_id = ?
            `, [lessonSequence, sectionId]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryStorymodeImages: async (storymodeExerciseId) => {
        try {
            const [result] = await pool.query(`
                SELECT i.*
                FROM storymode_images i
                INNER JOIN storymode_exercises s
                ON i.storymode_exercise_id = s.id
                WHERE i.storymode_exercise_id = ?
            `, [storymodeExerciseId]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryStorymodeImageSequence: async (url, exerciseId) => {
        try {
            const [result] = await pool.query(`
                SELECT sequence
                FROM storymode_images
                WHERE url = ? AND storymode_exercise_id = ?
            `, [url, exerciseId]);

            return result[0].sequence;
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
            `,
                [exerciseToInsert.task,
                exerciseToInsert.options,
                exerciseToInsert.correctAnswer,
                exerciseToInsert.lessonId,
                exerciseToInsert.taskTypesId,
                exerciseToInsert.optionTypesId
                ]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertStorymodeExercise: async (exerciseToInsert) => {
        try {
            const addExerciseQuery = await pool.query(`
                INSERT INTO storymode_exercises (task, premium_lessons_id)
                VALUES (?, ?)
            `, [exerciseToInsert.task, exerciseToInsert.lessonId]);

            return addExerciseQuery[0].insertId;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertStorymodeImages: async (url, sequence, lastInsertedId) => {
        try {
            await pool.query(`
                INSERT INTO storymode_images (url, sequence, storymode_exercise_id)
                VALUES (?, ?, ?)
            `, [url, sequence, lastInsertedId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryFreeLessonTaskTypes: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM exercise_task_types
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryFreeLessonOptionTypes: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM exercise_option_types
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateFreeExercise: async (exercise) => {
        try {
            await pool.query(`
                    UPDATE free_exercises
                    SET task = ?, options = ?, correct_answer = ?, exercise_task_types_id = ?, exercise_option_types_id = ?
                    WHERE id = ?
                `, [exercise.task, exercise.options, exercise.correctAnswer, exercise.taskTypesId, exercise.optionTypesId, exercise.id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateExerciseDeletedStatus: async (id) => {
        try {
            await pool.query(`
                    UPDATE free_exercises
                    SET is_deleted = 1
                    WHERE id = ?
                `, [id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}