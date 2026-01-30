const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'crash',
    category: 'fun',
    description: 'Play crash game',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);
        const cashoutAt = parseFloat(args[1]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.crash <amount> <cashout_multiplier>`');
        }

        if (!cashoutAt || cashoutAt < 1.1 || cashoutAt > 10) {
            return message.reply('❌ Please specify a cashout multiplier between 1.1 and 10! Usage: `.crash <amount> <cashout_multiplier>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        // Generate crash point (weighted towards lower values)
        const random = Math.random();
        let crashPoint;
        
        if (random < 0.5) crashPoint = 1 + Math.random() * 0.5; // 50% chance: 1.0-1.5x
        else if (random < 0.8) crashPoint = 1.5 + Math.random() * 1.5; // 30% chance: 1.5-3.0x
        else crashPoint = 3 + Math.random() * 7; // 20% chance: 3.0-10.0x

        crashPoint = Math.round(crashPoint * 100) / 100;

        const win = cashoutAt <= crashPoint;

        if (win) {
            const winAmount = Math.floor(amount * cashoutAt);
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0x00ff00,
                title: '🚀 CRASH - YOU WIN! 🚀',
                description: `You cashed out at **${cashoutAt}x** and the game crashed at **${crashPoint}x**!\n\n🎉 You won **$${formatMoney(winAmount - amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet',
                        value: `$${formatMoney(amount)}`,
                        inline: true
                    },
                    {
                        name: '📊 Cashout',
                        value: `${cashoutAt}x`,
                        inline: true
                    },
                    {
                        name: '💥 Crashed At',
                        value: `${crashPoint}x`,
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
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0xff0000,
                title: '💥 CRASH - YOU LOST! 💥',
                description: `The game crashed at **${crashPoint}x** before you could cash out at **${cashoutAt}x**!\n\n💔 You lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet',
                        value: `$${formatMoney(amount)}`,
                        inline: true
                    },
                    {
                        name: '📊 Cashout',
                        value: `${cashoutAt}x`,
                        inline: true
                    },
                    {
                        name: '💥 Crashed At',
                        value: `${crashPoint}x`,
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
    }
};
