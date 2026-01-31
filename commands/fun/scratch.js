const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'scratch',
    category: 'fun',
    description: 'Buy and scratch a lottery card',
    aliases: ['scratchcard'],
    async execute(message, args, client) {
        const amount = parseInt(args[0]) || 100;

        if (amount < 100) {
            return message.reply('❌ Minimum scratch card price is $100!');
        }

        const user = await client.db.getUser(message.author.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣'];
        const card = [
            symbols[getRandomInt(0, symbols.length - 1)],
            symbols[getRandomInt(0, symbols.length - 1)],
            symbols[getRandomInt(0, symbols.length - 1)]
        ];

        let multiplier = 0;
        if (card[0] === card[1] && card[1] === card[2]) {
            if (card[0] === '💎') multiplier = 10;
            else if (card[0] === '7️⃣') multiplier = 7;
            else multiplier = 5;
        } else if (card[0] === card[1] || card[1] === card[2] || card[0] === card[2]) {
            multiplier = 2;
        }

        const winAmount = amount * multiplier;
        const profit = winAmount - amount;

        if (multiplier > 0) {
            await client.db.addMoney(message.author.id, profit);
            if (multiplier > 1) {
                await client.db.updateUser(message.author.id, {
                    wins: (user._raw.wins || 0) + 1,
                    totalGambled: (user._raw.totalGambled || 0) + amount
                });
            }
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: (user._raw.losses || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });
        }

        const newBalance = ((await client.db.getUser(message.author.id))).wallet;

        const embed = {
            color: multiplier > 1 ? 0x00ff00 : multiplier === 1 ? 0xffff00 : 0xff0000,
            title: '🎫 SCRATCH CARD 🎫',
            description: `**[ ${card[0]} | ${card[1]} | ${card[2]} ]**\n\n${multiplier > 1 ? '🎉 YOU WIN!' : multiplier === 1 ? '😐 BREAK EVEN' : '💔 NO WIN'}`,
            fields: [
                {
                    name: '💰 Card Price',
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
