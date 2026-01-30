const { formatMoney } = require('../../utils/permissions');

module.exports = {
    name: 'withdraw',
    category: 'economy',
    description: 'Withdraw money from your bank',
    aliases: ['wd', 'with'],
    async execute(message, args, client) {
        const user = client.db.getUser(message.author.id);
        let amount;

        if (args[0]?.toLowerCase() === 'all') {
            amount = user.economy.bank;
        } else {
            amount = parseInt(args[0]);
        }

        if (!amount || amount < 1) {
            return message.reply('❌ Please specify a valid amount! Usage: `.withdraw <amount>` or `.withdraw all`');
        }

        if (user.economy.bank < amount) {
            return message.reply(`❌ You don't have enough money in your bank! You have **$${formatMoney(user.economy.bank)}**.`);
        }

        await client.db.removeMoney(message.author.id, amount, 'bank');
        await client.db.addMoney(message.author.id, amount, 'wallet');

        const updatedUser = client.db.getUser(message.author.id);

        const embed = {
            color: 0x00ff00,
            title: '🏦 Withdrawal Successful!',
            description: `You withdrew **$${formatMoney(amount)}** from your bank!`,
            fields: [
                {
                    name: '👛 Wallet',
                    value: `$${formatMoney(updatedUser.wallet)}`,
                    inline: true
                },
                {
                    name: '🏦 Bank',
                    value: `$${formatMoney(updatedUser.bank)}`,
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
