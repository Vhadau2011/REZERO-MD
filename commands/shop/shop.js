const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'shop',
    description: 'View the shop',
    async execute(message, args, client) {
        const shop = client.db.getShop();
        const shopItems = Object.entries(shop);

        if (shopItems.length === 0) {
            return message.reply('🏪 The shop is currently empty!');
        }

        const itemsPerPage = 10;
        const page = parseInt(args[0]) || 1;
        const totalPages = Math.ceil(shopItems.length / itemsPerPage);

        if (page < 1 || page > totalPages) {
            return message.reply(`❌ Invalid page number! Please choose a page between 1 and ${totalPages}.`);
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageItems = shopItems.slice(startIndex, endIndex);

        const fields = pageItems.map(([id, item]) => ({
            name: `${item.name} (ID: ${id})`,
            value: `💰 Price: $${formatMoney(item.price)}\n📝 ${item.description || 'No description'}`,
            inline: false
        }));

        const embed = {
            color: 0x00aaff,
            title: '🏪 SHOP',
            description: `Welcome to the shop! Use \`${process.env.PREFIX}buy <item_id>\` to purchase an item.`,
            fields: fields,
            footer: {
                text: `Page ${page}/${totalPages} | Total Items: ${shopItems.length}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
