const { pool } = require("../db/database");

module.exports = {
    queryAllSections: () => {
        const result = pool
        .query(`SELECT * FROM sections`)
        .then(([result]) => result)
        .catch((err) => console.log(err));

        return result;
    },
    queryLessons: (id) => {
        const result = pool
        .query(`
            SELECT * FROM lessons
            WHERE sections_id = ?`, [id])
        .then(([result]) => result)
        .catch((err) => console.log(err));

        return result;
    }
}