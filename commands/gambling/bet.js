const { isGamblingChannel, formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'bet',
    description: 'Bet your money with 50/50 odds',
    async execute(message, args, client) {
        // Check if command is used in gambling channel
        if (!isGamblingChannel(message.channel.id)) {
            return message.reply('❌ This command can only be used in designated gambling channels!');
        }

        const amount = parseInt(args[0]);
        
        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.bet <amount>`');
        }

        const user = client.db.getUser(message.author.id);
        
        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const win = getRandomInt(0, 1) === 1;
        
        if (win) {
            await client.db.addMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });
            
            const newBalance = client.db.getUser(message.author.id).wallet;
            
            const embed = {
                color: 0x00ff00,
                title: '🎲 BET - YOU WON! 🎲',
                description: `🎉 Congratulations! You won **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet Amount',
                        value: `$${formatMoney(amount)}`,
                        inline: true
                    },
                    {
                        name: '🎁 Won',
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
        } else {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });
            
            const newBalance = client.db.getUser(message.author.id).wallet;
            
            const embed = {
                color: 0xff0000,
                title: '🎲 BET - YOU LOST! 🎲',
                description: `💔 Better luck next time! You lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet Amount',
                        value: `$${formatMoney(amount)}`,
                        inline: true
                    },
                    {
                        name: '📉 Lost',
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
    }
};
