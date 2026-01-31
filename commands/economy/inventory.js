module.exports = {
    name: 'inventory',
    category: 'economy',
    description: 'View your inventory',
    aliases: ['inv', 'items'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const user = await client.db.getUser(target.id);

        if (user.economy.inventory.length === 0) {
            return message.reply(`📦 ${target.username}'s inventory is empty!`);
        }

        const fields = user.economy.inventory.map((item, index) => ({
            name: `${index + 1}. ${item.name}`,
            value: item.description || 'No description',
            inline: false
        }));

        const embed = {
            color: 0x00aaff,
            title: `📦 ${target.username}'s Inventory`,
            description: `Total Items: ${user.economy.inventory.length}`,
            fields: fields,
            footer: {
                text: `${target.tag}`,
                icon_url: target.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
