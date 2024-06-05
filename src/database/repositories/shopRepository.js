const { pool } = require("../db-config");

module.exports = {
    queryShopItems: async () => {
        try {
            const [result] = await pool.query(`
                SELECT st.id, st.quantity, st.cost, stt.item_type, pt.payment_type
                FROM shop_items st
                INNER JOIN shop_item_types stt
                ON st.shop_item_types_id = stt.id
                INNER JOIN payment_types pt
                ON st.payment_types_id = pt.id
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryItem: async (id) => {
        try {
            const [result] = await pool.query(`
                SELECT st.id, st.quantity, st.cost, stt.item_type, stt.item_type_bulgarian
                FROM shop_items st
                INNER JOIN shop_item_types stt
                ON st.shop_item_types_id = stt.id
                WHERE st.id = ?
            `, [id]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
}