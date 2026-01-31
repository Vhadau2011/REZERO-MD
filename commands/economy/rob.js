const { formatMoney, getCooldownTime, formatTime, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'rob',
    category: 'economy',
    description: 'Rob another user',
    async execute(message, args, client) {
        const target = message.mentions.users.first();

        if (!target) {
            return message.reply('❌ Please mention a user to rob!');
        }

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot rob yourself!');
        }

        if (target.bot) {
            return message.reply('❌ You cannot rob bots!');
        }

        const user = await client.db.getUser(message.author.id);
        const targetUser = await client.db.getUser(target.id);

        const cooldown = 60 * 60 * 1000; // 1 hour
        const timeLeft = getCooldownTime((user._raw.lastRob || 0), cooldown);

        if (timeLeft > 0) {
            return message.reply(`⏰ You need to wait **${formatTime(timeLeft)}** before robbing again!`);
        }

        if (targetUser.wallet < 100) {
            return message.reply('❌ This user doesn\'t have enough money to rob!');
        }

        const success = getRandomInt(1, 100) <= 50;

        await client.db.updateUser(message.author.id, { lastRob: Date.now() });

        if (success) {
            const amount = Math.floor(targetUser.wallet * getRandomInt(10, 30) / 100);
            await client.db.removeMoney(target.id, amount);
            await client.db.addMoney(message.author.id, amount);

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0x00ff00,
                title: '💰 Robbery Successful!',
                description: `You successfully robbed **$${formatMoney(amount)}** from ${target}!`,
                fields: [
                    {
                        name: '💵 New Balance',
                        value: `$${formatMoney(newBalance)}`,
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
        } else {
            const fine = Math.min(user.economy.wallet, getRandomInt(100, 500));
            await client.db.removeMoney(message.author.id, fine);

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0xff0000,
                title: '👮 Robbery Failed!',
                description: `You got caught trying to rob ${target} and paid a fine of **$${formatMoney(fine)}**!`,
                fields: [
                    {
                        name: '💵 New Balance',
                        value: `$${formatMoney(newBalance)}`,
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
    }
};
