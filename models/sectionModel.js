const { pool } = require("../db/database");

module.exports = {
    queryAllSections: () => {
        const result = pool
        .query(`
            SELECT * FROM sections
            ORDER BY sequence`)
        .then(([result]) => result)
        .catch((err) => console.log(err));

        return result;
    },
    queryLessons: (id) => {
        const result = pool
        .query(`
            SELECT * FROM lessons l
            INNER JOIN sections s
            ON l.sections_id = s.id
            WHERE s.sequence = ?
            ORDER BY l.sequence`, [id])
        .then(([result]) => result)
        .catch((err) => console.log(err));

        return result;
    }
}