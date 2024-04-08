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
            await pool.query(`
                INSERT INTO users (username, email, password)
                VALUES(?, ?, ?)
            `, [userInformation.username, userInformation.email, userInformation.password]);
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
                SELECT id, username, password, user_types_id
                FROM users
                WHERE username = ?
            `, [username]);

            return result[0];
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}