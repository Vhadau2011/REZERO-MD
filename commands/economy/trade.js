module.exports = {
    name: 'trade',
    category: 'economy',
    description: 'Trade items with another user',
    async execute(message, args, client) {
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply('❌ Please mention a user to trade with! Usage: `.trade @user`');
        }

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot trade with yourself!');
        }

        if (target.bot) {
            return message.reply('❌ You cannot trade with bots!');
        }

        const user = client.db.getUser(message.author.id);
        const targetUser = client.db.getUser(target.id);

        if (user.economy.inventory.length === 0) {
            return message.reply('❌ You don\'t have any items to trade!');
        }

        const embed = {
            color: 0x00aaff,
            title: '🤝 Trade Request',
            description: `${message.author} wants to trade with ${target}!\n\nThis is a simplified trade system. Use the shop to buy and sell items.`,
            fields: [
                {
                    name: '📦 Your Items',
                    value: user.economy.inventory.length > 0 ? user.economy.inventory.map(i => i.name).join(', ') : 'None',
                    inline: false
                },
                {
                    name: '📦 Their Items',
                    value: targetUser.inventory.length > 0 ? targetUser.inventory.map(i => i.name).join(', ') : 'None',
                    inline: false
                }
            ],
            footer: {
                text: 'Use .give to send money or .buy/.sell for items',
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
