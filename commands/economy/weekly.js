const { formatMoney, getCooldownTime, formatTime } = require('../../utils/permissions');

module.exports = {
    name: 'weekly',
    description: 'Claim your weekly reward',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        const cooldown = 7 * 24 * 60 * 60 * 1000; // 7 days
        const timeLeft = getCooldownTime(user.lastWeekly, cooldown);

        if (timeLeft > 0) {
            return message.reply(`⏰ You already claimed your weekly reward! Come back in **${formatTime(timeLeft)}**.`);
        }

        const amount = 5000;
        await client.db.addMoney(message.author.id, amount);
        await client.db.updateUser(message.author.id, { lastWeekly: Date.now() });

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: 0x00ff00,
            title: '🎁 Weekly Reward Claimed!',
            description: `You received **$${formatMoney(amount)}**!`,
            fields: [
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: true
                },
                {
                    name: '⏰ Next Weekly',
                    value: '7 days',
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
