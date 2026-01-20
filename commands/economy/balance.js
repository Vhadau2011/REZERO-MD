const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'balance',
    description: 'Check your balance',
    aliases: ['bal', 'money'],
    async execute(message, args, client) {
        const target = message.mentions.users.first() || message.author;
        const user = client.db.getUser(target.id);

        const total = user.wallet + user.bank;

        const embed = {
            color: 0x00aaff,
            title: `💰 ${target.username}'s Balance`,
            fields: [
                {
                    name: '👛 Wallet',
                    value: `$${formatMoney(user.wallet)}`,
                    inline: true
                },
                {
                    name: '🏦 Bank',
                    value: `$${formatMoney(user.bank)}`,
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
