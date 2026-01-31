const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'blackjack',
    category: 'fun',
    description: 'Play blackjack',
    aliases: ['bj', '21'],
    async execute(message, args, client) {
        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.blackjack <amount>`');
        }

        const user = await client.db.getUser(message.author.id, message.author.username);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const getCard = () => {
            const cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 11];
            return cards[getRandomInt(0, cards.length - 1)];
        };

        const calculateTotal = (cards) => {
            let total = cards.reduce((a, b) => a + b, 0);
            let aces = cards.filter(c => c === 11).length;
            
            while (total > 21 && aces > 0) {
                total -= 10;
                aces--;
            }
            
            return total;
        };

        const playerCards = [getCard(), getCard()];
        const dealerCards = [getCard(), getCard()];

        const playerTotal = calculateTotal(playerCards);
        const dealerTotal = calculateTotal(dealerCards);

        let result = '';
        let win = false;

        if (playerTotal === 21) {
            result = '🎉 BLACKJACK! YOU WIN!';
            win = true;
        } else if (playerTotal > 21) {
            result = '💔 BUST! YOU LOST!';
        } else if (dealerTotal > 21) {
            result = '🎉 DEALER BUST! YOU WIN!';
            win = true;
        } else if (playerTotal > dealerTotal) {
            result = '🎉 YOU WIN!';
            win = true;
        } else if (playerTotal < dealerTotal) {
            result = '💔 YOU LOST!';
        } else {
            result = '😐 TIE!';
            win = null;
        }

        if (win === true) {
            await client.db.addMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                wins: (user._raw.wins || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });
        } else if (win === false) {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: (user._raw.losses || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });
        }

        const updatedUser = await client.db.getUser(message.author.id);
        const newBalance = updatedUser.economy.wallet;

        const embed = {
            color: win === true ? 0x00ff00 : win === false ? 0xff0000 : 0xffff00,
            title: '🃏 BLACKJACK 🃏',
            description: result,
            fields: [
                {
                    name: '🎴 Your Cards',
                    value: `${playerCards.join(', ')} = **${playerTotal}**`,
                    inline: true
                },
                {
                    name: '🎴 Dealer Cards',
                    value: `${dealerCards.join(', ')} = **${dealerTotal}**`,
                    inline: true
                },
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: win === true ? '🎁 Won' : win === false ? '📉 Lost' : '💵 Returned',
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
