const { formatMoney, getCooldownTime, formatTime, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'work',
    description: 'Work to earn money',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        const cooldown = 60 * 60 * 1000; // 1 hour
        const timeLeft = getCooldownTime(user.lastWork, cooldown);

        if (timeLeft > 0) {
            return message.reply(`⏰ You're tired! Rest for **${formatTime(timeLeft)}** before working again.`);
        }

        const jobs = [
            'programmer', 'doctor', 'teacher', 'chef', 'artist', 'musician',
            'writer', 'engineer', 'scientist', 'designer', 'streamer', 'youtuber'
        ];

        const job = jobs[getRandomInt(0, jobs.length - 1)];
        const amount = getRandomInt(200, 500);

        await client.db.addMoney(message.author.id, amount);
        await client.db.updateUser(message.author.id, { lastWork: Date.now() });

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: 0x00ff00,
            title: '💼 Work Complete!',
            description: `You worked as a **${job}** and earned **$${formatMoney(amount)}**!`,
            fields: [
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: true
                },
                {
                    name: '⏰ Next Work',
                    value: '1 hour',
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
