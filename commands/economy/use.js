module.exports = {
    name: 'use',
    category: 'economy',
    description: 'Use an item from your inventory',
    async execute(message, args, client) {
        const itemName = args.join(' ');

        if (!itemName) {
            return message.reply('❌ Please specify an item name! Usage: `.use <item_name>`');
        }

        const user = await client.db.getUser(message.author.id);
        const item = user.economy.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());

        if (!item) {
            return message.reply('❌ You don\'t have this item in your inventory!');
        }

        // Remove item from inventory
        await client.db.removeItem(message.author.id, item.name);

        const embed = {
            color: 0x00ff00,
            title: '✅ Item Used',
            description: `You used **${item.name}**!`,
            fields: [
                {
                    name: '📝 Description',
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
