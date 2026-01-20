const { isGamblingChannel, formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'slot',
    description: 'Play the slot machine',
    aliases: ['slots'],
    async execute(message, args, client) {
        // Check if command is used in gambling channel
        if (!isGamblingChannel(message.channel.id)) {
            return message.reply('❌ This command can only be used in designated gambling channels!');
        }

        const amount = parseInt(args[0]);
        
        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.slot <amount>`');
        }

        const user = client.db.getUser(message.author.id);
        
        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const symbols = ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣'];
        const slot1 = symbols[getRandomInt(0, symbols.length - 1)];
        const slot2 = symbols[getRandomInt(0, symbols.length - 1)];
        const slot3 = symbols[getRandomInt(0, symbols.length - 1)];

        let winAmount = 0;
        let result = '';

        if (slot1 === slot2 && slot2 === slot3) {
            // All three match
            if (slot1 === '💎') {
                winAmount = amount * 10;
                result = '💎 JACKPOT! 💎';
            } else if (slot1 === '7️⃣') {
                winAmount = amount * 7;
                result = '🎰 TRIPLE SEVEN! 🎰';
            } else {
                winAmount = amount * 5;
                result = '🎉 THREE OF A KIND! 🎉';
            }
        } else if (slot1 === slot2 || slot2 === slot3 || slot1 === slot3) {
            // Two match
            winAmount = amount * 2;
            result = '✨ TWO OF A KIND! ✨';
        } else {
            // No match
            result = '💔 NO MATCH 💔';
        }

        if (winAmount > 0) {
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });
        }

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: winAmount > 0 ? 0x00ff00 : 0xff0000,
            title: '🎰 SLOT MACHINE 🎰',
            description: `**[ ${slot1} | ${slot2} | ${slot3} ]**\n\n${result}`,
            fields: [
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: winAmount > 0 ? '🎁 Won' : '📉 Lost',
                    value: `$${formatMoney(winAmount > 0 ? winAmount - amount : amount)}`,
                    inline: true
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
};
