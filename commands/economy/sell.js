const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'sell',
    category: 'economy',
    description: 'Sell an item from your inventory',
    async execute(message, args, client) {
        const itemName = args.join(' ');

        if (!itemName) {
            return message.reply('❌ Please specify an item name! Usage: `.sell <item_name>`');
        }

        const user = client.db.getUser(message.author.id);
        const item = user.economy.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (!item) {
            return message.reply('❌ You don\'t have this item in your inventory!');
        }

        // Find item in shop to get original price
        const shop = client.db.getShop();
        const shopItem = Object.values(shop).find(si => si.name === item.name);
        const sellPrice = shopItem ? Math.floor(shopItem.price * 0.5) : 100;

        // Remove item and add money
        await client.db.removeItem(message.author.id, item.name);
        await client.db.addMoney(message.author.id, sellPrice);

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: 0x00ff00,
            title: '💰 Item Sold',
            description: `You sold **${item.name}** for **$${formatMoney(sellPrice)}**!`,
            fields: [
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: true
                }
            ],
            footer: {
                text: `${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
