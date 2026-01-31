const { isGamblingChannel, formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'coinflip',
    category: 'gambling',
    description: 'Flip a coin - heads or tails',
    aliases: ['cf', 'flip'],
    async execute(message, args, client) {
        // Check if command is used in gambling channel
        if (!isGamblingChannel(message.channel.id)) {
            return message.reply('❌ This command can only be used in designated gambling channels!');
        }

        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();
        
        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.coinflip <amount> <heads/tails>`');
        }

        if (!choice || !['heads', 'tails', 'h', 't'].includes(choice)) {
            return message.reply('❌ Please choose heads or tails! Usage: `.coinflip <amount> <heads/tails>`');
        }

        const user = await client.db.getUser(message.author.id);
        
        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        const normalizedChoice = choice === 'h' ? 'heads' : choice === 't' ? 'tails' : choice;
        const result = getRandomInt(0, 1) === 0 ? 'heads' : 'tails';
        const win = normalizedChoice === result;

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

        const newBalance = ((await client.db.getUser(message.author.id))).wallet;

        const coinEmoji = result === 'heads' ? '🪙' : '💰';

        const embed = {
            color: win ? 0x00ff00 : 0xff0000,
            title: '🪙 COIN FLIP 🪙',
            description: `The coin flips in the air...\n\n${coinEmoji} It's **${result.toUpperCase()}**!\n\n${win ? '🎉 YOU WIN! 🎉' : '💔 YOU LOST! 💔'}`,
            fields: [
                {
                    name: '🎯 Your Choice',
                    value: normalizedChoice.toUpperCase(),
                    inline: true
                },
                {
                    name: '🎲 Result',
                    value: result.toUpperCase(),
                    inline: true
                },
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: win ? '🎁 Won' : '📉 Lost',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: '📊 Multiplier',
                    value: win ? '2x' : '0x',
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
