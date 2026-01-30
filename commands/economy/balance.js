const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'balance',
    category: 'economy',
    description: 'Check your balance',
    aliases: ['bal', 'money'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const user = await client.db.getUser(target.id);

        const total = user.economy.wallet + user.economy.bank;

        const embed = {
            color: 0x00aaff,
            title: `💰 ${target.username}'s Balance`,
            fields: [
                {
                    name: '👛 Wallet',
                    value: `$${formatMoney(user.economy.wallet)}`,
                    inline: true
                },
                {
                    name: '🏦 Bank',
                    value: `$${formatMoney(user.economy.bank)}`,
                    inline: true
                },
                {
                    name: '💵 Total',
                    value: `$${formatMoney(total)}`,
                    inline: true
                }
            ],
            footer: {
                text: `${target.tag}`,
                icon_url: target.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
