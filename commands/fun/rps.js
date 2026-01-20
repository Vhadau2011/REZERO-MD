const { formatMoney, getRandomInt } = require('../../utils/permissions');

module.exports = {
    name: 'rps',
    description: 'Play rock paper scissors',
    async execute(message, args, client) {
        const amount = parseInt(args[0]);
        const choice = args[1]?.toLowerCase();

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.rps <amount> <rock/paper/scissors>`');
        }

        if (!choice || !['rock', 'paper', 'scissors', 'r', 'p', 's'].includes(choice)) {
            return message.reply('❌ Please choose rock, paper, or scissors! Usage: `.rps <amount> <rock/paper/scissors>`');
        }

        const user = client.db.getUser(message.author.id);

        if (user.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.wallet)}** in your wallet.`);
        }

        const choices = ['rock', 'paper', 'scissors'];
        const normalizedChoice = choice === 'r' ? 'rock' : choice === 'p' ? 'paper' : choice === 's' ? 'scissors' : choice;
        const botChoice = choices[getRandomInt(0, 2)];

        const emojis = {
            rock: '🪨',
            paper: '📄',
            scissors: '✂️'
        };

        let result = '';
        let win = false;
        let tie = false;

        if (normalizedChoice === botChoice) {
            result = 'TIE!';
            tie = true;
        } else if (
            (normalizedChoice === 'rock' && botChoice === 'scissors') ||
            (normalizedChoice === 'paper' && botChoice === 'rock') ||
            (normalizedChoice === 'scissors' && botChoice === 'paper')
        ) {
            result = 'YOU WIN!';
            win = true;
        } else {
            result = 'YOU LOST!';
        }

        if (win) {
            await client.db.addMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                wins: user.wins + 1,
                totalGambled: user.totalGambled + amount
            });
        } else if (!tie) {
            await client.db.removeMoney(message.author.id, amount);
            await client.db.updateUser(message.author.id, {
                losses: user.losses + 1,
                totalGambled: user.totalGambled + amount
            });
        }

        const newBalance = client.db.getUser(message.author.id).wallet;

        const embed = {
            color: win ? 0x00ff00 : tie ? 0xffff00 : 0xff0000,
            title: `${emojis[normalizedChoice]} ROCK PAPER SCISSORS ${emojis[botChoice]}`,
            description: `**${result}**\n\nYou chose **${emojis[normalizedChoice]} ${normalizedChoice}**\nBot chose **${emojis[botChoice]} ${botChoice}**`,
            fields: [
                {
                    name: '💰 Bet',
                    value: `$${formatMoney(amount)}`,
                    inline: true
                },
                {
                    name: win ? '🎁 Won' : tie ? '💵 Returned' : '📉 Lost',
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
