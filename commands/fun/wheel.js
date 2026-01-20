const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'wheel',
    description: 'Spin the wheel of fortune',
    aliases: ['spin'],
    async execute(message, args, client) {
        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.wheel <amount>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const outcomes = [
            { name: '💎 JACKPOT', multiplier: 10, chance: 5 },
            { name: '🌟 BIG WIN', multiplier: 5, chance: 10 },
            { name: '✨ WIN', multiplier: 2, chance: 25 },
            { name: '😐 BREAK EVEN', multiplier: 1, chance: 20 },
            { name: '💔 LOSE', multiplier: 0, chance: 40 }
        ];

        const roll = getRandomInt(1, 100);
        let cumulative = 0;
        let result = outcomes[outcomes.length - 1];

        for (const outcome of outcomes) {
            cumulative += outcome.chance;
            if (roll <= cumulative) {
                result = outcome;
                break;
            }
        }

        const winAmount = amount * result.multiplier;
        const profit = winAmount - amount;

        if (result.multiplier > 0) {
            await client.db.addMoney(message.author.id, profit);
            if (result.multiplier > 1) {
                await client.db.updateUser(message.author.id, {
                    wins: user.wins + 1,
                    totalGambled: user.totalGambled + amount
                });
            }
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });
        }

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: result.multiplier > 1 ? 0x00ff00 : result.multiplier === 1 ? 0xffff00 : 0xff0000,
            title: '🎡 WHEEL OF FORTUNE 🎡',
            description: `The wheel spins... and lands on:\n\n**${result.name}**`,
            fields: [
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: '📊 Multiplier',
                    value: `${result.multiplier}x`,
                    inline: true
                },
                {
                    name: result.multiplier > 1 ? '🎁 Won' : result.multiplier === 1 ? '💵 Returned' : '📉 Lost',
                    value: `$${formatMoney(Math.abs(profit))}`,
                    inline: true
                },
                {
                    name: '💵 New Balance',
                    value: `$${formatMoney(newBalance)}`,
                    inline: false
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
