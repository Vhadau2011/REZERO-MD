const { isGamblingChannel, formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'rolate',
    category: 'gambling',
    description: 'Play roulette - bet on red, black, or green',
    aliases: ['roulette'],
    async execute(message, args, client) {
        // Check if command is used in gambling channel
        if (!isGamblingChannel(message.channel.id)) {
            return message.reply('❌ This command can only be used in designated gambling channels!');
        }

        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();
        
        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.rolate <amount> <red/black/green>`');
        }

        if (!choice || !['red', 'black', 'green'].includes(choice)) {
            return message.reply('❌ Please choose red, black, or green! Usage: `.rolate <amount> <red/black/green>`');
        }

        const user = client.db.getUser(message.author.id);
        
        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        // Roulette numbers
        const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
        const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];
        const greenNumbers = [0];

        const spin = getRandomInt(0, 36);
        let spinColor = '';
        
        if (greenNumbers.includes(spin)) {
            spinColor = 'green';
        } else if (redNumbers.includes(spin)) {
            spinColor = 'red';
        } else {
            spinColor = 'black';
        }

        let winAmount = 0;
        let multiplier = 0;

        if (choice === spinColor) {
            if (choice === 'green') {
                multiplier = 14;
                winAmount = amount * multiplier;
            } else {
                multiplier = 2;
                winAmount = amount * multiplier;
            }
        }

        const profit = winAmount - amount;

        if (winAmount > 0) {
            await client.db.addMoney(message.author.id, profit);
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

        const colorEmoji = {
            red: '🔴',
            black: '⚫',
            green: '🟢'
        };

        const embed = {
            color: winAmount > 0 ? 0x00ff00 : 0xff0000,
            title: '🎡 ROULETTE 🎡',
            description: `The wheel spins... and lands on **${colorEmoji[spinColor]} ${spin}**!\n\n${winAmount > 0 ? '🎉 YOU WIN! 🎉' : '💔 YOU LOST! 💔'}`,
            fields: [
                {
                    name: '🎯 Your Choice',
                    value: `${colorEmoji[choice]} ${choice.toUpperCase()}`,
                    inline: true
                },
                {
                    name: '🎲 Result',
                    value: `${colorEmoji[spinColor]} ${spin} (${spinColor.toUpperCase()})`,
                    inline: true
                },
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: winAmount > 0 ? '🎁 Won' : '📉 Lost',
                    value: `$${formatMoney(Math.abs(profit))}`,
                    inline: true
                },
                {
                    name: '📊 Multiplier',
                    value: `${multiplier}x`,
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
