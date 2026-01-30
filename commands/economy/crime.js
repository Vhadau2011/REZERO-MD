const { formatMoney, getCooldownTime, formatTime, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'crime',
    category: 'economy',
    description: 'Commit a crime (high risk, high reward)',
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        const cooldown = 2 * 60 * 60 * 1000; // 2 hours
        const timeLeft = getCooldownTime(user.economy.lastCrime, cooldown);

        if (timeLeft > 0) {
            return message.reply(`⏰ The cops are watching! Wait **${formatTime(timeLeft)}** before committing another crime.`);
        }

        const crimes = [
            { name: 'robbed a bank', success: 30, reward: [1000, 3000], fine: [500, 1500] },
            { name: 'stole a car', success: 50, reward: [500, 1500], fine: [300, 800] },
            { name: 'pickpocketed someone', success: 70, reward: [200, 600], fine: [100, 300] },
            { name: 'hacked a computer', success: 40, reward: [800, 2000], fine: [400, 1000] }
        ];

        const crime = crimes[getRandomInt(0, crimes.length - 1)];
        const success = getRandomInt(1, 100) <= crime.success;

        await client.db.updateUser(message.author.id, { lastCrime: Date.now() });

        if (success) {
            const amount = getRandomInt(crime.reward[0], crime.reward[1]);
            await client.db.addMoney(message.author.id, amount);

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0x00ff00,
                title: '🦹 Crime Successful!',
                description: `You successfully **${crime.name}** and got away with **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '💵 New Balance',
                        value: `$${formatMoney(newBalance)}`,
                        inline: true
                    },
                    {
                        name: '⏰ Next Crime',
                        value: '2 hours',
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
            const fine = getRandomInt(crime.fine[0], crime.fine[1]);
            const actualFine = Math.min(fine, user.economy.wallet);
            await client.db.removeMoney(message.author.id, actualFine);

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0xff0000,
                title: '👮 Crime Failed!',
                description: `You tried to **${crime.name}** but got caught! You paid a fine of **$${formatMoney(actualFine)}**!`,
                fields: [
                    {
                        name: '💵 New Balance',
                        value: `$${formatMoney(newBalance)}`,
                        inline: true
                    },
                    {
                        name: '⏰ Next Crime',
                        value: '2 hours',
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
