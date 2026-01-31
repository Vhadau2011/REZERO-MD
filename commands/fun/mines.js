const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'mines',
    category: 'fun',
    description: 'Play mines game',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.mines <amount>`');
        }

        const user = await client.db.getUser(message.author.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        // Create 5x5 grid with 5 mines
        const gridSize = 25;
        const mineCount = 5;
        const mines = [];
        
        while (mines.length < mineCount) {
            const pos = getRandomInt(0, gridSize - 1);
            if (!mines.includes(pos)) mines.push(pos);
        }

        // Player clicks random position
        const clickPos = getRandomInt(0, gridSize - 1);
        const hitMine = mines.includes(clickPos);

        if (hitMine) {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: (user._raw.losses || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0xff0000,
                title: '💣 MINES - YOU LOST! 💣',
                description: `💥 You hit a mine and lost **$${formatMoney(amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet',
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
            const multiplier = 2.5;
            const winAmount = Math.floor(amount * multiplier);
            await client.db.addMoney(message.author.id, winAmount - amount);
            await client.db.updateUser(message.author.id, {
                wins: (user._raw.wins || 0) + 1,
                totalGambled: (user._raw.totalGambled || 0) + amount
            });

            const newBalance = ((await client.db.getUser(message.author.id))).wallet;

            const embed = {
                color: 0x00ff00,
                title: '💎 MINES - YOU WIN! 💎',
                description: `✨ You found a safe spot and won **$${formatMoney(winAmount - amount)}**!`,
                fields: [
                    {
                        name: '💰 Bet',
                        value: `$${formatMoney(amount)}`,
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
    }
};
