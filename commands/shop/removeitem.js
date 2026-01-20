const { isOwner } = require('../../utils/permissions');

module.exports = {
    name: 'removeitem',
    description: 'Remove an item from the shop (Owner only)',
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('❌ Only the bot owner can use this command!');
        }

        const itemId = args[0];

        if (!itemId) {
            return message.reply('❌ Please specify an item ID! Usage: `.removeitem <item_id>`');
        }

        const shop = client.db.getShop();
        const item = shop[itemId];

        if (!item) {
            return message.reply('❌ Item not found in shop!');
        }

        await client.db.removeShopItem(itemId);

        const embed = {
            color: 0xff0000,
            title: '🗑️ Item Removed from Shop',
            description: `**${item.name}** (ID: ${itemId}) has been removed from the shop.`,
            footer: {
                text: `Removed by ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
