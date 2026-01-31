const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'dice',
    category: 'fun',
    description: 'Roll dice and bet on the outcome',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);
        const guess = parseInt(args[1]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.dice <amount> <guess (1-6)>`');
        }

        if (!guess || guess < 1 || guess > 6) {
            return message.reply('❌ Please guess a number between 1 and 6! Usage: `.dice <amount> <guess (1-6)>`');
        }

        const user = await client.db.getUser(message.author.id, message.author.username);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const roll = getRandomInt(1, 6);
        const win = roll === guess;

        if (win) {
            const winAmount = amount * 5;
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: (user._raw.wins || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });

            const updatedUser = await client.db.getUser(message.author.id);
            const newBalance = updatedUser.economy.wallet;

            const embed = {
                color: 0x00ff00,
                title: '🎲 DICE ROLL - YOU WIN! 🎲',
                description: `The dice rolled a **${roll}**!\n\n🎉 You guessed correctly and won **$${formatMoney(winAmount - amount)}**!`,
                fields: [
                    {
                        name: '🎯 Your Guess',
                        value: `${guess}`,
                        inline: true
                    },
                    {
                        name: '🎲 Roll',
                        value: `${roll}`,
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
                losses: (user._raw.losses || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });

            const updatedUser = await client.db.getUser(message.author.id);
            const newBalance = updatedUser.economy.wallet;

            const embed = {
                color: 0xff0000,
                title: '🎲 DICE ROLL - YOU LOST! 🎲',
                description: `The dice rolled a **${roll}**!\n\n💔 You guessed wrong and lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '🎯 Your Guess',
                        value: `${guess}`,
                        inline: true
                    },
                    {
                        name: '🎲 Roll',
                        value: `${roll}`,
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
