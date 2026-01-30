const { formatMoney, getCooldownTime, formatTime } = require('../../utils/permissions');

module.exports = {
    name: 'daily',
    category: 'economy',
    description: 'Claim your daily reward',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours
        const timeLeft = getCooldownTime(user.economy.lastDaily, cooldown);

        if (timeLeft > 0) {
            return message.reply(`⏰ You already claimed your daily reward! Come back in **${formatTime(timeLeft)}**.`);
        }

        const amount = 1000;
        await client.db.addMoney(message.author.id, amount);
        await client.db.updateUser(message.author.id, { lastDaily: Date.now() });

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: 0x00ff00,
            title: '🎁 Daily Reward Claimed!',
            description: `You received **$${formatMoney(amount)}**!`,
            fields: [
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: true
                },
                {
                    name: '⏰ Next Daily',
                    value: '24 hours',
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
