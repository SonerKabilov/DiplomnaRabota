const { pool } = require("../db-config");

module.exports = {
    checkIfUserExists: async (username, email) => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM users
                WHERE username = ? OR email = ?
            `, [username, email]);

            if (result.length === 0) {
                return false;
            }

            return true;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createUserProfile: async (userInformation) => {
        try {
            const addUserQuery = await pool.query(`
                INSERT INTO users (username, email, password)
                VALUES(?, ?, ?)
            `, [userInformation.username, userInformation.email, userInformation.password]);

            const lastInsertedId = addUserQuery[0].insertId;

            await pool.query(`
                INSERT INTO courses_taken (courses_id, users_id)
                VALUES (?, ?)
            `, [userInformation.courseId, lastInsertedId]);

            const insertedUser = await pool.query(`
                SELECT * 
                FROM users 
                WHERE id = ?
            `, [lastInsertedId]);

            return insertedUser[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    createAdminProfile: async (userInformation) => {
        try {
            await pool.query(`
                    INSERT INTO users (username, email, password, user_types_id)
                    VALUES(?, ?, ?, ?)
            `, [userInformation.username, userInformation.email, userInformation.password, userInformation.userTypesId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    findUser: async (username) => {
        try {
            const [result] = await pool.query(`
                SELECT id, username, password, user_types_id, currency
                FROM users
                WHERE username = ?
            `, [username]);

            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getUserProgress: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT on_lesson
                FROM courses_taken
                WHERE users_id = ?
            `, [userId]);

            return result[0].on_lesson;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateUserProgress: async (onLesson, userId, language) => {
        try {
            await pool.query(`
                UPDATE courses_taken ct
                INNER JOIN courses c ON ct.courses_id = c.id
                SET on_lesson = ?
                WHERE ct.users_id = ? AND c.language = ?
            `, [onLesson, userId, language]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateUserCurrency: async (currency, userId) => {
        try {
            await pool.query(`
                UPDATE users
                SET currency = currency + ?
                WHERE id = ?
            `, [currency, userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getUserCurrency: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT currency
                FROM users
                WHERE id = ?
            `, [userId]);

            return result[0].currency;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateCurrency: async (currency, userId) => {
        try {
            await pool.query(`
                UPDATE users
                SET currency = currency + ?
                WHERE id = ?
            `, [currency, userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    reduceCurrency: async (cost, userId) => {
        try {
            await pool.query(`
                UPDATE users
                SET currency = currency - ?
                WHERE id = ?
            `, [cost, userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    getUserMembership: async (userId) => {
        try {
            const [result] = await pool.query(`
                SELECT membership_exp_date
                FROM users
                WHERE id = ?
            `, [userId]);

            return result[0].membership_exp_date;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateMembership: async (membershipDate, userId) => {
        try {
            await pool.query(`
                UPDATE users
                SET membership_exp_date = ?
                WHERE id = ?
            `, [membershipDate, userId]);

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}