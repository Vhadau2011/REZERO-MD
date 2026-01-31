const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'highlow',
    category: 'fun',
    description: 'Guess if the next card is higher or lower',
    aliases: ['hl'],
    async execute(message, args, client) {
        const amount = parseInt(args[0]);
        const guess = args[1]?.toLowerCase();

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.highlow <amount> <high/low>`');
        }

        if (!guess || !['high', 'low', 'h', 'l'].includes(guess)) {
            return message.reply('❌ Please choose high or low! Usage: `.highlow <amount> <high/low>`');
        }

        const user = await client.db.getUser(message.author.id, message.author.username);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const currentCard = getRandomInt(2, 14);
        const nextCard = getRandomInt(2, 14);
        const normalizedGuess = (guess === 'h' || guess === 'high') ? 'high' : 'low';

        let win = false;
        if (normalizedGuess === 'high' && nextCard > currentCard) win = true;
        if (normalizedGuess === 'low' && nextCard < currentCard) win = true;

        if (win) {
            await client.db.addMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                wins: (user._raw.wins || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: (user._raw.losses || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });
        }

        const updatedUser = await client.db.getUser(message.author.id);
        const newBalance = updatedUser.economy.wallet;

        const embed = {
            color: win ? 0x00ff00 : 0xff0000,
            title: '🃏 HIGH OR LOW 🃏',
            description: `Current Card: **${currentCard}**\nNext Card: **${nextCard}**\n\n${win ? '🎉 YOU WIN!' : '💔 YOU LOST!'}`,
            fields: [
                {
                    name: '🎯 Your Guess',
                    value: normalizedGuess.toUpperCase(),
                    inline: true
                },
                {
                    name: win ? '🎁 Won' : '📉 Lost',
                    value: `$${formatMoney(amount)}`,
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
