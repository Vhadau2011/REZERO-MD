const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'guess',
    description: 'Guess a number between 1-10',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);
        const guess = parseInt(args[1]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.guess <amount> <number 1-10>`');
        }

        if (!guess || guess < 1 || guess > 10) {
            return message.reply('❌ Please guess a number between 1 and 10! Usage: `.guess <amount> <number 1-10>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const number = getRandomInt(1, 10);
        const win = number === guess;

        if (win) {
            const winAmount = amount * 8;
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0x00ff00,
                title: '🎯 GUESS THE NUMBER - YOU WIN! 🎯',
                description: `The number was **${number}**!\n\n🎉 You guessed correctly and won **$${formatMoney(winAmount - amount)}**!`,
                fields: [
                    {
                        name: '🎯 Your Guess',
                        value: `${guess}`,
                        inline: true
                    },
                    {
                        name: '🔢 Number',
                        value: `${number}`,
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
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });

            const newBalance = client.db.getUser(message.author.id).wallet;

            const embed = {
                color: 0xff0000,
                title: '🎯 GUESS THE NUMBER - YOU LOST! 🎯',
                description: `The number was **${number}**!\n\n💔 You guessed wrong and lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '🎯 Your Guess',
                        value: `${guess}`,
                        inline: true
                    },
                    {
                        name: '🔢 Number',
                        value: `${number}`,
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
    }
};
