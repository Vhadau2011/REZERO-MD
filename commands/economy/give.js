const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'give',
    category: 'economy',
    description: 'Give money to another user',
    aliases: ['pay', 'send'],
    async execute(message, args, client) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) {
            return message.reply('❌ Please mention a user! Usage: `.give @user <amount>`');
        }

        if (target.id === message.author.id) {
            return message.reply('❌ You cannot give money to yourself!');
        }

        if (target.bot) {
            return message.reply('❌ You cannot give money to bots!');
        }

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.give @user <amount>`');
        }

        const user = await client.db.getUser(message.author.id);

        if (user.economy.wallet < amount) {
            return message.reply(`❌ You don't have enough money! You have **$${formatMoney(user.economy.wallet)}** in your wallet.`);
        }

        await client.db.removeMoney(message.author.id, amount);
        await client.db.addMoney(target.id, amount);

        const newUser = await client.db.getUser(message.author.id);
        const newBalance = newUser.wallet;

        const embed = {
            color: 0x00ff00,
            title: '💸 Money Sent!',
            description: `${message.author} gave **$${formatMoney(amount)}** to ${target}!`,
            fields: [
                {
                    name: '💵 Your New Balance',
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
