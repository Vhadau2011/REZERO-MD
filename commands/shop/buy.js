const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'buy',
    description: 'Buy an item from the shop',
    async execute(message, args, client) {
        const itemId = args[0];

        if (!itemId) {
            return message.reply(`❌ Please specify an item ID! Usage: \`${process.env.PREFIX}buy <item_id>\``);
        }

        const shop = client.db.getShop();
        const item = shop[itemId];

        if (!item) {
            return message.reply('❌ Item not found! Use `.shop` to view available items.');
        }

        const user = client.db.getUser(message.author.id);

        if (user.wallet < item.price) {
            return message.reply(`❌ You don't have enough money! You need **$${formatMoney(item.price)}** but you only have **$${formatMoney(user.wallet)}**.`);
        }

        // Check if user already has this item
        const hasItem = user.inventory.some(i => i.id === itemId);
        if (hasItem) {
            return message.reply('❌ You already own this item!');
        }

        // Remove money and add item
        await client.db.removeMoney(message.author.id, item.price);
        await client.db.addItem(message.author.id, {
            id: itemId,
            name: item.name,
            description: item.description,
            purchasedAt: Date.now()
        });

        // If item has a role, try to assign it
        if (item.role && message.guild) {
            try {
                const role = message.guild.roles.cache.get(item.role);
                if (role) {
                    await message.member.roles.add(role);
                }
            } catch (error) {
                console.error('Error assigning role:', error);
            }
        }

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: 0x00ff00,
            title: '✅ Purchase Successful!',
            description: `You have successfully purchased **${item.name}**!`,
            fields: [
                {
                    name: '💰 Price',
                    value: `$${formatMoney(item.price)}`,
                    inline: true
                },
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: true
                },
                {
                    name: '📦 Item',
                    value: item.description || 'No description',
                    inline: false
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
