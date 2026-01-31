const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'fight',
    category: 'fun',
    description: 'Fight another user',
    async execute(message, args, client) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) {
            return message.reply('❌ Please mention a user to fight! Usage: `.fight @user <amount>`');
        }

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot fight yourself!');
        }

        if (target.bot) {
            return message.reply('❌ You cannot fight bots!');
        }

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid bet amount! Usage: `.fight @user <amount>`');
        }

        const user = await client.db.getUser(message.author.id);
        const targetUser = await client.db.getUser(target.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        if (targetUser.wallet < amount) {
            return message.reply(`❌ ${target.username} doesn't have enough money!`);
        }

        const win = getRandomInt(0, 1) === 1;

        if (win) {
            await client.db.removeMoney(target.id, amount);
            await client.db.addMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                wins: (user._raw.wins || 0) + 1
            });

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0x00ff00,
                title: '⚔️ FIGHT - YOU WIN! ⚔️',
                description: `${message.author} defeated ${target} and won **$${formatMoney(amount)}**!`,
                fields: [
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
            await client.db.addMoney(target.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: (user._raw.losses || 0) + 1
            });

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0xff0000,
                title: '⚔️ FIGHT - YOU LOST! ⚔️',
                description: `${target} defeated ${message.author} and won **$${formatMoney(amount)}**!`,
                fields: [
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
