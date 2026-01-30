const { isGamblingChannel, formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'gamble',
    category: 'gambling',
    description: 'Gamble your money with varying multipliers',
    async execute(message, args, client) {
        // Check if command is used in gambling channel
        if (!isGamblingChannel(message.channel.id)) {
            return message.reply('❌ This command can only be used in designated gambling channels!');
        }

        const amount = parseInt(args[0]);
        
        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.gamble <amount>`');
        }

        const user = client.db.getUser(message.author.id);
        
        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const chance = getRandomInt(1, 100);
        let multiplier = 0;
        let result = '';

        if (chance <= 5) {
            // 5% chance - 10x multiplier
            multiplier = 10;
            result = '💎 MEGA WIN! 💎';
        } else if (chance <= 15) {
            // 10% chance - 5x multiplier
            multiplier = 5;
            result = '🌟 BIG WIN! 🌟';
        } else if (chance <= 35) {
            // 20% chance - 2x multiplier
            multiplier = 2;
            result = '✨ YOU WIN! ✨';
        } else if (chance <= 50) {
            // 15% chance - break even
            multiplier = 1;
            result = '😐 BREAK EVEN 😐';
        } else {
            // 50% chance - lose
            multiplier = 0;
            result = '💔 YOU LOST! 💔';
        }

        const winAmount = amount * multiplier;
        const profit = winAmount - amount;

        if (multiplier > 0) {
            await client.db.addMoney(message.author.id, profit);
            if (multiplier > 1) {
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
            color: multiplier > 1 ? 0x00ff00 : multiplier === 1 ? 0xffff00 : 0xff0000,
            title: '🎰 GAMBLE 🎰',
            description: result,
            fields: [
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: '📊 Multiplier',
                    value: `${multiplier}x`,
                    inline: true
                },
                {
                    name: multiplier > 1 ? '🎁 Won' : multiplier === 1 ? '💵 Returned' : '📉 Lost',
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
                text: `${message.author.tag} | Chance: ${chance}%`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
