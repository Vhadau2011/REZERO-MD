const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'slots2',
    description: 'Alternative slot machine with different symbols',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.slots2 <amount>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const symbols = ['🔔', '⭐', '🎰', '💰', '🍀', '👑'];
        const slot1 = symbols[getRandomInt(0, symbols.length - 1)];
        const slot2 = symbols[getRandomInt(0, symbols.length - 1)];
        const slot3 = symbols[getRandomInt(0, symbols.length - 1)];

        let multiplier = 0;
        let result = '';

        if (slot1 === slot2 && slot2 === slot3) {
            if (slot1 === '👑') {
                multiplier = 15;
                result = '👑 ROYAL JACKPOT! 👑';
            } else if (slot1 === '🍀') {
                multiplier = 10;
                result = '🍀 LUCKY JACKPOT! 🍀';
            } else {
                multiplier = 6;
                result = '🎉 THREE OF A KIND! 🎉';
            }
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            multiplier = 2;
            result = '✨ TWO OF A KIND! ✨';
        } else {
            result = '💔 NO MATCH 💔';
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
            title: '🎰 PREMIUM SLOTS 🎰',
            description: `**[ ${slot1} | ${slot2} | ${slot3} ]**\n\n${result}`,
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
                text: `${message.author.tag}`,
                icon_url: message.author.displayAvatarURL()
            },
            timestamp: new Date()
        };

        message.reply({ embeds: [embed] });
    }
};
