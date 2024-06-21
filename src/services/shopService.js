const { format } = require('date-fns');

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
    },
    getShopItemTypes: async () => {
        return await shopRepository.queryShopItemTypes();
    },
    getPaymentTypes: async () => {
        return await shopRepository.queryPaymentTypes();
    },
    addShopItem: async (shopItem) => {
        return await shopRepository.insertShopItem(shopItem);
    },
    updateShopItem: async (shopItem) => {
        if (shopItem.paymentType) {
            await shopRepository.updateShopItemWithPaymentType(shopItem);
        } else {
            await shopRepository.updateShopItemWithoutPaymentType(shopItem);
        }
    },
    deleteShopItem: async (id) => {
        return await shopRepository.deleteShopItem(id);
    },
    addPaymentHistory: async (itemId, userId) => {
        const now = new Date();
        const formattedCurrentDate = format(now, 'yyyy-MM-dd HH:mm:ss');

        return await shopRepository.insertPaymentHistory(formattedCurrentDate, itemId, userId);
    },
    getPurchaseHistory: async (userId) => {
        const purchaseHistory = await shopRepository.queryPurchaseHistory(userId);

        for (const product of purchaseHistory) {
            product.date = format(product.date, 'yyyy-MM-dd HH:mm:ss');
        }
        
        return purchaseHistory;
    }
}