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
                WHERE is_deleted = 1
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
                WHERE st.id = ? AND is_deleted = 1
            `, [id]);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryShopItemTypes: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM shop_item_types
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPaymentTypes: async () => {
        try {
            const [result] = await pool.query(`
                SELECT *
                FROM payment_types
            `);

            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertShopItem: async (shopItem) => {
        try {
            await pool.query(`
                INSERT INTO shop_items (quantity, cost, shop_item_types_id, payment_types_id)
                VALUES (?, ?, ?, ?)
            `, [shopItem.quantity, shopItem.cost, shopItem.itemType, shopItem.paymentType]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateShopItemWithoutPaymentType: async (shopItem) => {
        try {
            await pool.query(`
                UPDATE shop_items
                SET quantity = ?, cost = ?
                WHERE id = ?
            `, [shopItem.quantity, shopItem.cost, shopItem.id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    updateShopItemWithPaymentType: async (shopItem) => {
        try {
            await pool.query(`
                UPDATE shop_items
                SET quantity = ?, cost = ?, payment_types_id = ?
                WHERE id = ?
            `, [shopItem.quantity, shopItem.cost, shopItem.paymentType, shopItem.id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    deleteShopItem: async (id) => {
        try {
            await pool.query(`
                UPDATE shop_items
                SET is_deleted = 0
                WHERE id = ?
            `, [id]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    insertPaymentHistory: async (date, itemId, userId) => {
        try {
            await pool.query(`
                INSERT INTO purchase_history (date, shop_items_id, users_id)
                VALUES (?, ?, ?)
            `, [date, itemId, userId]);
        } catch (err) {
            console.error(err);
            throw err;
        }
    },
    queryPurchaseHistory: async () => {
        try {
            const [result] = await pool.query(`
                SELECT ph.date, st.quantity, st.cost, stt.item_type, stt.item_type_bulgarian, pt.payment_type
                FROM purchase_history ph
                INNER JOIN shop_items st
                ON ph.shop_items_id = st.id
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
    }
}