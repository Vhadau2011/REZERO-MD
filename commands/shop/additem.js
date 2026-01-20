const { isOwner } = require('../../utils/permissions');

module.exports = {
    name: 'additem',
    description: 'Add an item to the shop (Owner only)',
    async execute(message, args, client) {
        if (!isOwner(message.author.id)) {
            return message.reply('❌ Only the bot owner can use this command!');
        }

        // Format: .additem <id> <price> <name> | <description> | <role_id>
        if (args.length < 3) {
            return message.reply('❌ Usage: `.additem <id> <price> <name> | <description> | <role_id>`\nExample: `.additem vip 5000 VIP Role | Access to VIP features | 123456789`');
        }

        const itemId = args[0];
        const price = parseInt(args[1]);

        if (isNaN(price) || price < 0) {
            return message.reply('❌ Please provide a valid price!');
        }

        const restArgs = args.slice(2).join(' ').split('|').map(s => s.trim());
        const name = restArgs[0] || 'Unnamed Item';
        const description = restArgs[1] || 'No description';
        const roleId = restArgs[2] || null;

        const item = {
            name: name,
            price: price,
            description: description,
            role: roleId
        };

        await client.db.addShopItem(itemId, item);

        const embed = {
            color: 0x00ff00,
            title: '✅ Item Added to Shop',
            fields: [
                {
                    name: '🆔 ID',
                    value: itemId,
                    inline: true
                },
                {
                    name: '📛 Name',
                    value: name,
                    inline: true
                },
                {
                    name: '💰 Price',
                    value: `$${price.toLocaleString()}`,
                    inline: true
                },
                {
                    name: '📝 Description',
                    value: description,
                    inline: false
                },
                {
                    name: '🎭 Role',
                    value: roleId || 'None',
                    inline: false
                }
            ],
            footer: {
                text: `Added by ${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
