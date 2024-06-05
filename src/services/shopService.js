const shopRepository = require('../database/repositories/shopRepository');

module.exports = {
    getShopItems: async () => {
        const shopItems = await shopRepository.queryShopItems();
        let memberships = [], coins = [];

        for (const shopItem of shopItems) {
            if (shopItem.item_type === "membership") {
                memberships.push(shopItem);
            } else if (shopItem.item_type === "coins") {
                coins.push(shopItem);
            }
        }

        return { memberships, coins };
    },
    getItemForPurchasing: async (id) => {
        return await shopRepository.queryItem(id);
    }
}