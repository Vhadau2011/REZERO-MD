const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'race',
    category: 'fun',
    description: 'Race against others',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.race <amount>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const racers = ['🐎 Horse', '🏎️ Car', '🚀 Rocket', '🐆 Cheetah', '🏃 Runner'];
        const positions = racers.map((racer, index) => ({ racer, position: getRandomInt(1, 100) }))
            .sort((a, b) => b.position - a.position);

        const yourPosition = getRandomInt(0, racers.length - 1);
        const win = yourPosition === 0;

        if (win) {
            const winAmount = amount * 3;
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0x00ff00,
                title: '🏁 RACE - YOU WIN! 🏁',
                description: `🎉 You came in **1st place** and won **$${formatMoney(winAmount - amount)}**!`,
                fields: [
                    {
                        name: '🏆 Results',
                        value: positions.map((p, i) => `${i + 1}. ${p.racer}${i === yourPosition ? ' ⭐ (YOU)' : ''}`).join('\n'),
                        inline: false
                    },
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
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0xff0000,
                title: '🏁 RACE - YOU LOST! 🏁',
                description: `💔 You came in **${yourPosition + 1}${yourPosition === 0 ? 'st' : yourPosition === 1 ? 'nd' : yourPosition === 2 ? 'rd' : 'th'} place** and lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '🏆 Results',
                        value: positions.map((p, i) => `${i + 1}. ${p.racer}${i === yourPosition ? ' ⭐ (YOU)' : ''}`).join('\n'),
                        inline: false
                    },
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
